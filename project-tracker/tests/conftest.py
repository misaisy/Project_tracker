import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.base import Base
from app.db.session import get_db

ASYNC_SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://test_user:test_password@localhost:5432/test_db"

engine = create_async_engine(
    ASYNC_SQLALCHEMY_DATABASE_URL,
    future=True,
    echo=True
)

AsyncTestingSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture(scope="function")
async def db():
    async with AsyncTestingSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

@pytest.fixture(scope="function")
async def client(db):
    async def override_get_db():
        return db

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client