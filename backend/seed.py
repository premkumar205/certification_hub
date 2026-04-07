import sys
import os
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models
from auth import get_password_hash

def seed_data():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(models.User).count() > 0:
        print("Database already contains data. Skipping seeding.")
        db.close()
        return

    # Create Admin
    admin_user = models.User(
        username="admin",
        email="admin@certifyhub.com",
        phone="1234567890",
        hashed_password=get_password_hash("adminpass"),
        role="admin"
    )
    
    # Create Normal User
    normal_user = models.User(
        username="john_doe",
        email="john@example.com",
        phone="0987654321",
        hashed_password=get_password_hash("password123"),
        role="user"
    )
    
    db.add(admin_user)
    db.add(normal_user)
    db.commit()
    db.refresh(admin_user)
    db.refresh(normal_user)
    
    # Create Certificates for John Doe
    cert1 = models.Certificate(
        name="AWS Certified Solutions Architect",
        issuer="Amazon Web Services",
        date="2023-05-15",
        link="https://aws.amazon.com/certification/",
        user_id=normal_user.id
    )
    
    cert2 = models.Certificate(
        name="Frontend Developer Certificate",
        issuer="Meta",
        date="2023-08-20",
        link="https://coursera.org",
        user_id=normal_user.id
    )
    
    db.add(cert1)
    db.add(cert2)
    db.commit()
    
    print("Demo data successfully seeded!")
    db.close()

if __name__ == "__main__":
    seed_data()
