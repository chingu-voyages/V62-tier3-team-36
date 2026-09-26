import pytest

from app import create_app
from tests.conftest import TestConfig


@pytest.mark.parametrize("secret_key", [None, "", "dev-secret-change-me"])
def test_application_rejects_insecure_secret_keys(secret_key):
    class InsecureConfig(TestConfig):
        SECRET_KEY = secret_key

    with pytest.raises(RuntimeError, match="SECRET_KEY must be set"):
        create_app(InsecureConfig)
