from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = Field(
        ...,
        description="SQLAlchemy connection string for the Postgres database.",
    )


settings = Settings()
