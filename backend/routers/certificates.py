from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

import models, schemas, auth
from database import get_db

router = APIRouter(
    prefix="/certificates",
    tags=["certificates"]
)

@router.post("/", response_model=schemas.Certificate)
def create_certificate(
    certificate: schemas.CertificateCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Users can add their certificates"""
    db_certificate = models.Certificate(**certificate.model_dump(), user_id=current_user.id)
    db.add(db_certificate)
    db.commit()
    db.refresh(db_certificate)
    return db_certificate

@router.get("/me", response_model=List[schemas.Certificate])
def read_user_certificates(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Users can view their own certificates"""
    certificates = db.query(models.Certificate).filter(models.Certificate.user_id == current_user.id).all()
    return certificates

@router.get("/all", response_model=List[schemas.Certificate])
def read_all_certificates(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    """Admin only: View all certificates"""
    certificates = db.query(models.Certificate).all()
    return certificates

@router.get("/user/{user_id}", response_model=List[schemas.Certificate])
def read_user_certificates_by_admin(
    user_id: int,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    """Admin only: View certificates of a specific user"""
    certificates = db.query(models.Certificate).filter(models.Certificate.user_id == user_id).all()
    return certificates

from fastapi import HTTPException

@router.put("/{cert_id}/status", response_model=schemas.Certificate)
def update_certificate_status(
    cert_id: int,
    status_update: schemas.CertificateStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    """Admin only: Update status (verify/reject) of a certificate"""
    if status_update.status not in ["pending", "verified", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    cert = db.query(models.Certificate).filter(models.Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
        
    cert.status = status_update.status
    db.commit()
    db.refresh(cert)
    return cert
