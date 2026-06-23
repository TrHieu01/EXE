from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import database, schemas, crud, auth_utils

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email=login_data.email)
    if not user or not auth_utils.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Generate access token
    access_token = auth_utils.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(register_data: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email=register_data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email này đã được đăng ký sử dụng"
        )
        
    user = crud.create_user(db, user=register_data)
    access_token = auth_utils.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user = Depends(auth_utils.get_current_user)):
    return current_user
