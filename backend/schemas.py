from pydantic import BaseModel
from typing import List, Optional

class CertificateBase(BaseModel):
    name: str
    issuer: str
    date: str
    link: str
    photo: Optional[str] = None
    status: Optional[str] = "pending"

class CertificateCreate(CertificateBase):
    pass

class CertificateStatusUpdate(BaseModel):
    status: str

class Certificate(CertificateBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    phone: str
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    certificates: List[Certificate] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
