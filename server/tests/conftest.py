import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Create in-memory SQLite database for testing
DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass
            
    # Override database dependency in FastAPI app
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(db):
    from app import models
    from app.auth_utils import get_password_hash
    
    user = models.User(
        email="test.user@example.com",
        password_hash=get_password_hash("password123"),
        status="active"
    )
    db.add(user)
    db.flush()
    
    profile = models.UserProfile(
        user_id=user.id,
        full_name="Test User",
        gender="Male",
        bio="Test Bio",
        city="Hồ Chí Minh",
        district="Quận 7"
    )
    db.add(profile)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="function")
def test_sport(db):
    from app import models
    sport = models.Sport(
        name="Badminton",
        icon_url="https://example.com/badminton.png"
    )
    db.add(sport)
    db.commit()
    db.refresh(sport)
    return sport

@pytest.fixture(scope="function")
def test_venue(db, test_user):
    from app import models
    venue = models.Venue(
        name="Test Venue",
        address="123 Test St, District 7",
        latitude=10.74,
        longitude=106.71,
        description="Test Venue Description",
        owner_id=test_user.id
    )
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return venue

@pytest.fixture(scope="function")
def test_court(db, test_venue, test_sport):
    from app import models
    court = models.Court(
        venue_id=test_venue.id,
        name="Court 1",
        sport_id=test_sport.id,
        price_per_hour=100000
    )
    db.add(court)
    db.commit()
    db.refresh(court)
    return court

@pytest.fixture(scope="function")
def auth_headers(client, test_user):
    from app.auth_utils import create_access_token
    token = create_access_token(data={"sub": test_user.email})
    return {"Authorization": f"Bearer {token}"}

