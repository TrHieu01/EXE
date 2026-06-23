def test_register_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "new.user@example.com",
            "password": "securepassword",
            "name": "New User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_register_existing_email(client, test_user):
    response = client.post(
        "/api/auth/register",
        json={
            "email": test_user.email,
            "password": "somepassword",
            "name": "Duplicate User"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email này đã được đăng ký sử dụng"

def test_login_success(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_user.email,
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_credentials(client, test_user):
    # Wrong password
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_user.email,
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Email hoặc mật khẩu không chính xác"

    # Wrong email
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 401

def test_get_me_success(client, auth_headers, test_user):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user.email
    assert data["profile"]["full_name"] == "Test User"

def test_get_me_unauthorized(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    assert "detail" in response.json()

def test_login_rate_limiting(client, test_user):
    # Make 5 attempts
    for _ in range(5):
        response = client.post(
            "/api/auth/login",
            json={
                "email": test_user.email,
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401
    
    # 6th attempt should be rate limited (429)
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_user.email,
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 429
    assert response.json()["detail"] == "Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau."

def test_logout_invalidates_token(client, test_user):
    from app.auth_utils import create_access_token
    token = create_access_token(data={"sub": test_user.email})
    headers = {"Authorization": f"Bearer {token}"}
    
    # Verify we can access /me
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    
    # Call logout
    logout_response = client.post("/api/auth/logout", headers=headers)
    assert logout_response.status_code == 200
    assert logout_response.json() == {"message": "Logged out successfully"}
    
    # Verify we can NO LONGER access /me with the same token
    response2 = client.get("/api/auth/me", headers=headers)
    assert response2.status_code == 401

