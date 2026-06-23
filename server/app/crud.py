from sqlalchemy.orm import Session
from app import models, schemas
from datetime import datetime
import math

# User & Profile
def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    from app.auth_utils import get_password_hash
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create profile with user's name
    db_profile = models.UserProfile(user_id=db_user.id, full_name=user.name)
    db.add(db_profile)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_profile(db: Session, user_id: int, profile_update: schemas.UserProfileUpdate):
    db_profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if not db_profile:
        return None
    for key, value in profile_update.dict(exclude_unset=True).items():
        setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# Sports
def get_sports(db: Session):
    return db.query(models.Sport).all()

def create_sport(db: Session, name: str, icon_url: str = None):
    db_sport = models.Sport(name=name, icon_url=icon_url)
    db.add(db_sport)
    db.commit()
    db.refresh(db_sport)
    return db_sport

def add_user_sport(db: Session, user_id: int, user_sport: schemas.UserSportCreate):
    db_user_sport = models.UserSport(
        user_id=user_id,
        sport_id=user_sport.sport_id,
        skill_level=user_sport.skill_level,
    )
    db.add(db_user_sport)
    db.commit()
    db.refresh(db_user_sport)
    return db_user_sport

# Venues & Courts
def get_venues(db: Session):
    return db.query(models.Venue).all()

def get_venue_by_id(db: Session, venue_id: int):
    return db.query(models.Venue).filter(models.Venue.id == venue_id).first()

def create_venue(db: Session, venue: schemas.VenueCreate, owner_id: int = None):
    db_venue = models.Venue(
        name=venue.name,
        address=venue.address,
        latitude=venue.latitude,
        longitude=venue.longitude,
        description=venue.description,
        owner_id=owner_id
    )
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue

def get_court_by_id(db: Session, court_id: int):
    return db.query(models.Court).filter(models.Court.id == court_id).first()

def get_courts(db: Session, venue_id: int = None, sport_id: int = None):
    query = db.query(models.Court)
    if venue_id:
        query = query.filter(models.Court.venue_id == venue_id)
    if sport_id:
        query = query.filter(models.Court.sport_id == sport_id)
    return query.all()

def create_court(db: Session, court: schemas.CourtCreate):
    db_court = models.Court(
        venue_id=court.venue_id,
        name=court.name,
        sport_id=court.sport_id,
        price_per_hour=court.price_per_hour
    )
    db.add(db_court)
    db.commit()
    db.refresh(db_court)
    return db_court

def get_nearby_venues(db: Session, lat: float, lng: float, radius: float):
    # Proximity calculation using Haversine formula in Python (simple and failsafe)
    venues = db.query(models.Venue).filter(
        models.Venue.latitude.isnot(None),
        models.Venue.longitude.isnot(None)
    ).all()
    
    nearby = []
    for venue in venues:
        # Distance calculation
        R = 6371.0 # Radius of Earth in km
        lat1 = math.radians(lat)
        lng1 = math.radians(lng)
        lat2 = math.radians(venue.latitude)
        lng2 = math.radians(venue.longitude)
        
        dlon = lng2 - lng1
        dlat = lat2 - lat1
        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        if distance <= radius:
            nearby.append(venue)
            
    return nearby

# Bookings
def create_booking(db: Session, user_id: int, booking: schemas.BookingCreate):
    db_booking = models.Booking(
        court_id=booking.court_id,
        user_id=user_id,
        start_time=booking.start_time,
        end_time=booking.end_time,
        total_price=booking.total_price,
        status="confirmed"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_bookings(db: Session, user_id: int = None):
    query = db.query(models.Booking)
    if user_id:
        query = query.filter(models.Booking.user_id == user_id)
    return query.all()

def get_booking_by_id(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def cancel_booking(db: Session, booking_id: int):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if db_booking:
        db_booking.status = "cancelled"
        db.commit()
        db.refresh(db_booking)
    return db_booking

# Matches
def create_match(db: Session, host_id: int, match: schemas.MatchCreate):
    db_match = models.Match(
        host_id=host_id,
        sport_id=match.sport_id,
        court_id=match.court_id,
        title=match.title,
        description=match.description,
        required_level=match.required_level,
        start_time=match.start_time,
        end_time=match.end_time,
        max_players=match.max_players,
        status="OPEN"
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    
    # Host automatically joins the match
    db_host_participant = models.MatchParticipant(
        match_id=db_match.id,
        user_id=host_id,
        role="HOST",
        status="APPROVED"
    )
    db.add(db_host_participant)
    db.commit()
    db.refresh(db_match)
    return db_match

def get_matches(db: Session, sport_id: int = None, status: str = None):
    query = db.query(models.Match)
    if sport_id:
        query = query.filter(models.Match.sport_id == sport_id)
    if status:
        query = query.filter(models.Match.status == status)
    return query.all()

def get_match_by_id(db: Session, match_id: int):
    return db.query(models.Match).filter(models.Match.id == match_id).first()

def join_match(db: Session, match_id: int, user_id: int):
    # Check if participant already exists
    exists = db.query(models.MatchParticipant).filter(
        models.MatchParticipant.match_id == match_id,
        models.MatchParticipant.user_id == user_id
    ).first()
    if exists:
        return exists
        
    db_participant = models.MatchParticipant(
        match_id=match_id,
        user_id=user_id,
        role="PLAYER",
        status="APPROVED"  # Auto approve for simplicity, can be set to PENDING later
    )
    db.add(db_participant)
    
    # Update match status if max_players reached
    match = get_match_by_id(db, match_id)
    approved_count = db.query(models.MatchParticipant).filter(
        models.MatchParticipant.match_id == match_id,
        models.MatchParticipant.status == "APPROVED"
    ).count()
    if approved_count + 1 >= match.max_players:
        match.status = "FULL"
        
    db.commit()
    return db_participant

def leave_match(db: Session, match_id: int, user_id: int):
    db_participant = db.query(models.MatchParticipant).filter(
        models.MatchParticipant.match_id == match_id,
        models.MatchParticipant.user_id == user_id
    ).first()
    if db_participant:
        # If host leaves, cancel or reassign (for simplicity we cancel the match or delete the participant)
        is_host = db_participant.role == "HOST"
        db.delete(db_participant)
        
        match = get_match_by_id(db, match_id)
        if is_host:
            match.status = "CANCELLED"
        else:
            # If match was full, make it open again
            if match.status == "FULL":
                match.status = "OPEN"
                
        db.commit()
        return True
    return False
