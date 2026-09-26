# Forgot password setup and verification

## Architecture

- `POST /api/forgot_password` always returns the same `202` response for known
  and unknown email addresses.
- The API stores only a SHA-256 hash of the random reset token in MongoDB.
- `password_reset_tokens.expires_at` has a MongoDB TTL index.
- The raw token is sent only in the Resend email link.
- `POST /api/reset_password` consumes the token once, hashes the new password,
  and removes all outstanding reset tokens for the user.

## Local setup

1. Copy `.env.example` to `.env.local` and set the real MongoDB Atlas URI.
2. Create `views/.env.local` from `views/.env.local.example`.
3. Install backend dependencies:

   ```powershell
   python -m pip install -r requirements-dev.txt
   ```

4. Apply MongoDB collection validators and indexes:

   ```powershell
   flask --app app init-db
   ```

5. Start the backend and frontend:

   ```powershell
   flask --app app run --debug
   npm --prefix views run dev
   ```

## Resend setup

1. Create a Resend account and API key.
2. For a first test, keep `onboarding@resend.dev` as the sender. Resend may
   restrict this sender to the email address associated with the account.
3. For production, add and verify a domain in Resend, then set a sender such as
   `Sales Dashboard <password@your-domain.com>`.
4. Put `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in local `.env.local` and in the
   Render service environment. Never commit the API key.

## Automated tests

The tests use an in-memory MongoDB replacement and mock Resend, so they do not
modify Atlas data or send real email:

```powershell
pytest -q
```

## End-to-end test

1. Register a test user with an email inbox you control.
2. Submit that email on `/ForgotPassword`.
3. Confirm the API returns `202` without a token in the response.
4. Confirm one email appears in the Resend dashboard and inbox.
5. Open the link, submit a new password, and confirm redirection to
   `/PasswordResetSuccess`.
6. Confirm login fails with the old password and succeeds with the new one.
7. Reopen the same email link and confirm it is rejected as expired/used.
