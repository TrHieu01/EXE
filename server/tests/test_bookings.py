import pytest
from datetime import datetime, timezone, timedelta

@pytest.fixture
def test_booking(db, test_user, test_court):
    from app import models
    booking = models.Booking(
        court_id=test_court.id,
        user_id=test_user.id,
        start_time=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=1),
        end_time=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=1, hours=1),
        total_price=100000,
        status="confirmed"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def test_get_user_bookings_empty(client, auth_headers):
    response = client.get("/api/bookings", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 0

def test_get_user_bookings_populated(client, auth_headers, test_booking):
    response = client.get("/api/bookings", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == test_booking.id

def test_create_booking_success(client, auth_headers, test_court):
    start = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat()
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2, hours=1)).isoformat()
    
    response = client.post(
        "/api/bookings",
        headers=auth_headers,
        json={
            "court_id": test_court.id,
            "start_time": start,
            "end_time": end
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["court_id"] == test_court.id
    assert data["status"] == "confirmed"
    assert data["total_price"] == 100000

def test_create_booking_court_not_found(client, auth_headers):
    start = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat()
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2, hours=1)).isoformat()
    
    response = client.post(
        "/api/bookings",
        headers=auth_headers,
        json={
            "court_id": 999,
            "start_time": start,
            "end_time": end
        }
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Court not found"

def test_get_booking_details_success(client, auth_headers, test_booking):
    response = client.get(f"/api/bookings/{test_booking.id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == test_booking.id

def test_get_booking_details_unauthorized_other_user(client, db, test_booking):
    from app import models
    from app.auth_utils import get_password_hash, create_access_token
    
    # Create second user
    other_user = models.User(
        email="other@example.com",
        password_hash=get_password_hash("password123")
    )
    db.add(other_user)
    db.commit()
    
    other_token = create_access_token(data={"sub": other_user.email})
    other_headers = {"Authorization": f"Bearer {other_token}"}
    
    # Try fetching test_user's booking using other_user's headers
    response = client.get(f"/api/bookings/{test_booking.id}", headers=other_headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to view this booking"

def test_cancel_booking_success(client, auth_headers, test_booking):
    response = client.patch(f"/api/bookings/{test_booking.id}/cancel", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "cancelled"
    
    # Try to cancel again
    response_double = client.patch(f"/api/bookings/{test_booking.id}/cancel", headers=auth_headers)
    assert response_double.status_code == 400
    assert response_double.json()["detail"] == "Đơn đặt sân này đã bị hủy rồi"

def test_create_booking_invalid_times(client, auth_headers, test_court):
    # end_time <= start_time
    start = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2)).isoformat()
    end = (datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=2, hours=-1)).isoformat()
    
    response = client.post(
        "/api/bookings",
        headers=auth_headers,
        json={
            "court_id": test_court.id,
            "start_time": start,
            "end_time": end
        }
    )
    assert response.status_code == 422
    assert "Thời gian kết thúc phải lớn hơn thời gian bắt đầu" in response.text

def test_create_booking_overlap_conflict(client, auth_headers, test_court, test_booking):
    # Overlaps with test_booking (starts day 1, 1 hour duration)
    start_dt = test_booking.start_time + timedelta(minutes=30)
    end_dt = test_booking.start_time + timedelta(hours=1, minutes=30)
    
    response = client.post(
        "/api/bookings",
        headers=auth_headers,
        json={
            "court_id": test_court.id,
            "start_time": start_dt.isoformat(),
            "end_time": end_dt.isoformat()
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Sân đã được đặt trong khoảng thời gian này"
