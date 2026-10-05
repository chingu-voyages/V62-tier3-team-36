import hashlib
import secrets
import threading
from abc import ABC, abstractmethod
from datetime import datetime, timedelta, timezone
from typing import Optional
from db import get_db


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ResetTokenStore(ABC):
    """الواجهة التي يعتمد عليها باقي الكود. أي تخزين جديد يجب أن يطبّق هذه الدوال."""

    @abstractmethod
    def create(self, email: str, ttl_minutes: int) -> str:
        """ينشئ token ويرجع النسخة الأصلية (تُرسل بالإيميل فقط ولا تُخزَّن)."""

    @abstractmethod
    def peek(self, token: str) -> Optional[str]:
        """يتحقق من صلاحية الـ token دون استهلاكه. يرجع الإيميل أو None."""

    @abstractmethod
    def consume(self, token: str) -> Optional[str]:
        """يتحقق من الـ token ثم يحذفه (استخدام لمرة واحدة). يرجع الإيميل أو None."""


class InMemoryResetTokenStore(ResetTokenStore):
    """للتطوير فقط: تُفقد البيانات عند إعادة تشغيل السيرفر ولا تُشارك بين عدة workers."""

    def __init__(self):
        self._tokens = {}  # token_hash -> {"email": str, "expires_at": datetime}
        self._lock = threading.Lock()

    def _purge_expired(self) -> None:
        now = _now()
        for h in [h for h, d in self._tokens.items() if d["expires_at"] <= now]:
            del self._tokens[h]

    def create(self, email: str, ttl_minutes: int) -> str:
        email = email.strip().lower()
        raw_token = secrets.token_urlsafe(32)
        with self._lock:
            self._purge_expired()
            for h in [h for h, d in self._tokens.items() if d["email"] == email]:
                del self._tokens[h]
            self._tokens[hash_token(raw_token)] = {
                "email": email,
                "expires_at": _now() + timedelta(minutes=ttl_minutes),
            }
        return raw_token

    def peek(self, token: str) -> Optional[str]:
        with self._lock:
            self._purge_expired()
            data = self._tokens.get(hash_token(token))
            return data["email"] if data else None

    def consume(self, token: str) -> Optional[str]:
        with self._lock:
            self._purge_expired()
            data = self._tokens.pop(hash_token(token), None)
            return data["email"] if data else None


class MongoResetTokenStore(ResetTokenStore):
    """جاهز للاستخدام: MongoResetTokenStore(get_db) — نمرر الدالة نفسها، لا نتيجتها"""

    def __init__(self, get_db_func):
        self._get_db_func = get_db_func
        self._col = None

    @property
    def col(self):
        # يُنفَّذ فقط عند أول استخدام فعلي، أي داخل request context
        if self._col is None:
            db = self._get_db_func()
            col = db["password_reset_tokens"]
            col.create_index("expires_at", expireAfterSeconds=0)
            col.create_index("token_hash", unique=True)
            self._col = col
        return self._col

    def create(self, email: str, ttl_minutes: int) -> str:
        email = email.strip().lower()
        raw_token = secrets.token_urlsafe(32)
        self.col.delete_many({"email": email})
        self.col.insert_one({
            "token_hash": hash_token(raw_token),
            "email": email,
            "expires_at": _now() + timedelta(minutes=ttl_minutes),
        })
        return raw_token

    def peek(self, token: str) -> Optional[str]:
        doc = self.col.find_one({
            "token_hash": hash_token(token),
            "expires_at": {"$gt": _now()},
        })
        return doc["email"] if doc else None

    def consume(self, token: str) -> Optional[str]:
        doc = self.col.find_one_and_delete({
            "token_hash": hash_token(token),
            "expires_at": {"$gt": _now()},
        })
        return doc["email"] if doc else None


# النسخة المستخدمة في المشروع. عند ربط MongoDB بدّل هذا السطر فقط:
# token_store = MongoResetTokenStore(db)
token_store: ResetTokenStore = MongoResetTokenStore(get_db)