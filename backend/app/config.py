from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = Field(
        ...,
        min_length=1,
        description="SQLAlchemy connection string for the Postgres database.",
    )

    @field_validator("database_url")
    @classmethod
    def normalise_driver(cls, value: str) -> str:
        """Accept the URL shapes hosting providers hand out.

        Render, Heroku and friends supply `postgres://user:pass@host/db`, but
        SQLAlchemy needs an explicit driver: `postgresql+psycopg://...`.
        Rewriting it here means the deployed environment variable can be used
        exactly as given, with no manual editing.
        """
        for prefix in ("postgres://", "postgresql://"):
            if value.startswith(prefix):
                return "postgresql+psycopg://" + value[len(prefix) :]
        return value


settings = Settings()
