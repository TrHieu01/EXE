def test_get_all_courts(client, test_court):
    response = client.get("/api/courts")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == test_court.name
    assert data[0]["price_per_hour"] == test_court.price_per_hour

def test_get_courts_filter_by_sport(client, test_court, test_sport):
    # Filter by correct sport
    response = client.get(f"/api/courts?sport_id={test_sport.id}")
    assert response.status_code == 200
    assert len(response.json()) == 1

    # Filter by non-existent sport
    response = client.get("/api/courts?sport_id=999")
    assert response.status_code == 200
    assert len(response.json()) == 0

def test_get_court_by_id_success(client, test_court):
    response = client.get(f"/api/courts/{test_court.id}")
    assert response.status_code == 200
    assert response.json()["name"] == test_court.name

def test_get_court_by_id_not_found(client):
    response = client.get("/api/courts/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Court not found"

def test_get_nearby_venues(client, test_venue):
    response = client.get("/api/courts/nearby?lat=10.74&lng=106.71&radius=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == test_venue.name
