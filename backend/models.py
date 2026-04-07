from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="user") # "user" or "admin"

    certificates = relationship("Certificate", back_populates="owner")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    issuer = Column(String)
    date = Column(String)
    link = Column(String)
    photo = Column(String, nullable=True) # Optional photo/image link
    status = Column(String, default="pending") # "pending", "verified", "rejected"
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="certificates")
