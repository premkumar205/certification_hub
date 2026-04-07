from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

import models, schemas, auth
from database import get_db

router = APIRouter(
    tags=["users"]
)

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    email_val = user.email if user.email else None
    if email_val:
        db_email = db.query(models.User).filter(models.User.email == email_val).first()
        if db_email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    # Default newly registered users to 'user' role. Admin can be created manually in DB or via a special script.
    db_user = models.User(
        username=user.username,
        email=email_val,
        phone=user.phone,
        hashed_password=hashed_password,
        role=user.role if user.role in ["user", "admin"] else "user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == user_credentials.username).first()
    if not user or not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    """Get current logged in user details including role"""
    return current_user

@router.get("/users", response_model=list[schemas.User])
def get_all_users(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin_user)):
    """Admin Only: Get all users with their certificates"""
    users = db.query(models.User).all()
    return users
