import pytest
from datetime import datetime, timezone, timedelta

@pytest.fixture
def test_match(db, test_user, test_sport, test_court):
    from app import models
    match = models.Match(
        host_id=test_user.id,
        sport_id=test_sport.id,
        court_id=test_court.id,
        title="Test Match Title",
        description="Test Match Description",
        required_level="Intermediate",
        start_time=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=1),
        end_time=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=1, hours=2),
        max_players=4,
        status="OPEN"
    )
    db.add(match)
    db.commit()
    db.refresh(match)
    return match

def test_get_all_matches(client, test_match):
    response = client.get("/api/matches")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == test_match.title

def test_create_match_success(client, auth_headers, test_sport, test_court):
    start = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat()
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2, hours=2)).isoformat()
    
    response = client.post(
        "/api/matches",
        headers=auth_headers,
        json={
            "title": "New Match",
            "description": "Description",
            "sport_id": test_sport.id,
            "court_id": test_court.id,
            "required_level": "Beginner",
            "start_time": start,
            "end_time": end,
            "max_players": 6
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "New Match"
    assert data["max_players"] == 6

def test_create_match_unauthorized(client, test_sport, test_court):
    start = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat()
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2, hours=2)).isoformat()
    
    response = client.post(
        "/api/matches",
        json={
            "title": "New Match",
            "description": "Description",
            "sport_id": test_sport.id,
            "court_id": test_court.id,
            "required_level": "Beginner",
            "start_time": start,
            "end_time": end,
            "max_players": 6
        }
    )
    assert response.status_code == 401

def test_get_match_by_id_success(client, test_match):
    response = client.get(f"/api/matches/{test_match.id}")
    assert response.status_code == 200
    assert response.json()["title"] == test_match.title

def test_get_match_by_id_not_found(client):
    response = client.get("/api/matches/999")
    assert response.status_code == 404

def test_join_match_success(client, auth_headers, test_match):
    response = client.post(f"/api/matches/{test_match.id}/join", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["match_id"] == test_match.id
    assert data["status"] == "PENDING"  # Status is initially PENDING

def test_leave_match_success(client, db, auth_headers, test_user, test_match):
    from app import models
    # First, make the user participate
    participant = models.MatchParticipant(
        match_id=test_match.id,
        user_id=test_user.id,
        role="PLAYER",
        status="APPROVED"
    )
    db.add(participant)
    db.commit()
    
    response = client.post(f"/api/matches/{test_match.id}/leave", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Successfully left the match"

def test_leave_match_not_joined(client, auth_headers, test_match):
    response = client.post(f"/api/matches/{test_match.id}/leave", headers=auth_headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "You are not a participant in this match"

def test_create_match_invalid_players(client, auth_headers, test_sport, test_court):
    # max_players < 2
    start = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat()
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2, hours=2)).isoformat()
    
    response = client.post(
        "/api/matches",
        headers=auth_headers,
        json={
            "title": "Invalid Match",
            "sport_id": test_sport.id,
            "court_id": test_court.id,
            "required_level": "Beginner",
            "start_time": start,
            "end_time": end,
            "max_players": 1  # Invalid
        }
    )
    assert response.status_code == 422

def test_create_match_invalid_level(client, auth_headers, test_sport, test_court):
    # required_level is invalid
    start = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat()
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2, hours=2)).isoformat()
    
    response = client.post(
        "/api/matches",
        headers=auth_headers,
        json={
            "title": "Invalid Match",
            "sport_id": test_sport.id,
            "court_id": test_court.id,
            "required_level": "SuperPro",  # Invalid level
            "start_time": start,
            "end_time": end,
            "max_players": 4
        }
    )
    assert response.status_code == 422

def test_create_match_sport_not_found(client, auth_headers, test_court):
    start = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat()
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2, hours=2)).isoformat()
    
    response = client.post(
        "/api/matches",
        headers=auth_headers,
        json={
            "title": "Invalid Match",
            "sport_id": 999,  # Nonexistent sport
            "court_id": test_court.id,
            "required_level": "Intermediate",
            "start_time": start,
            "end_time": end,
            "max_players": 4
        }
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Sport not found"

def test_approve_participant_success(client, db, auth_headers, test_match):
    from app import models
    # Create another user that joins
    other_user = models.User(
        email="joiner@example.com",
        password_hash="hashedpassword"
    )
    db.add(other_user)
    db.commit()
    
    participant = models.MatchParticipant(
        match_id=test_match.id,
        user_id=other_user.id,
        role="PLAYER",
        status="PENDING"
    )
    db.add(participant)
    db.commit()
    
    # Host (auth_headers) approves participant
    response = client.patch(
        f"/api/matches/{test_match.id}/participants/{other_user.id}/status",
        headers=auth_headers,
        json={"status": "APPROVED"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "APPROVED"

def test_approve_participant_unauthorized(client, db, test_match):
    from app import models
    from app.auth_utils import create_access_token
    # Create another user that joins
    other_user = models.User(
        email="joiner2@example.com",
        password_hash="hashedpassword"
    )
    db.add(other_user)
    db.commit()
    
    participant = models.MatchParticipant(
        match_id=test_match.id,
        user_id=other_user.id,
        role="PLAYER",
        status="PENDING"
    )
    db.add(participant)
    db.commit()
    
    # Create non-host token
    non_host = models.User(
        email="nonhost@example.com",
        password_hash="hashedpassword"
    )
    db.add(non_host)
    db.commit()
    
    non_host_token = create_access_token(data={"sub": non_host.email})
    headers = {"Authorization": f"Bearer {non_host_token}"}
    
    # Try to approve -> should be 403 Forbidden
    response = client.patch(
        f"/api/matches/{test_match.id}/participants/{other_user.id}/status",
        headers=headers,
        json={"status": "APPROVED"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Only the host can update participant status"

def test_approve_host_forbidden(client, auth_headers, test_match):
    # Host (test_match.host_id) attempts to approve themselves
    response = client.patch(
        f"/api/matches/{test_match.id}/participants/{test_match.host_id}/status",
        headers=auth_headers,
        json={"status": "APPROVED"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Host status cannot be updated"

def test_host_leaves_transfers_host(client, db, auth_headers, test_user, test_match):
    from app import models
    # Host must be a participant in the match
    host_participant = models.MatchParticipant(
        match_id=test_match.id,
        user_id=test_user.id,
        role="HOST",
        status="APPROVED"
    )
    db.add(host_participant)
    db.commit()

    # Create another user that is APPROVED in the match
    other_user = models.User(
        email="approved_user@example.com",
        password_hash="hashedpassword"
    )
    db.add(other_user)
    db.commit()
    
    participant = models.MatchParticipant(
        match_id=test_match.id,
        user_id=other_user.id,
        role="PLAYER",
        status="APPROVED"
    )
    db.add(participant)
    db.commit()
    
    # Host (test_user, auth_headers) leaves the match
    response = client.post(f"/api/matches/{test_match.id}/leave", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Successfully left the match"
    
    # Verify the host was reassigned to approved_user
    db.refresh(test_match)
    assert test_match.host_id == other_user.id
    
    # Verify participant model role is now HOST
    db.refresh(participant)
    assert participant.role == "HOST"


