from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.session import get_db
from ..models.models import User, Hospital, Role
from ..schemas.schemas import UserCreate, HospitalCreate, User as UserSchema, HospitalResponse
from ..core.security import get_password_hash
from .auth import get_current_user

router = APIRouter()

def check_admin_role(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges",
        )
    return current_user

@router.post("/hospitals", response_model=HospitalResponse)
def create_hospital(
    hospital_in: HospitalCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_role)
):
    hospital = db.query(Hospital).filter(Hospital.email == hospital_in.email).first()
    if hospital:
        raise HTTPException(
            status_code=400,
            detail="A hospital with this email already exists.",
        )
    db_hospital = Hospital(
        name=hospital_in.name,
        contact_person=hospital_in.contact_person,
        email=hospital_in.email,
        address=hospital_in.address
    )
    db.add(db_hospital)
    db.commit()
    db.refresh(db_hospital)
    return db_hospital

@router.post("/users", response_model=UserSchema)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_role)
):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    
    # Verify hospital exists
    hospital = db.query(Hospital).filter(Hospital.id == user_in.hospital_id).first()
    if not hospital:
        raise HTTPException(
            status_code=404,
            detail="Hospital not found.",
        )
    
    # Verify role exists
    role = db.query(Role).filter(Role.id == user_in.role_id).first()
    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found.",
        )

    db_user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        hospital_id=user_in.hospital_id,
        role_id=user_in.role_id,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/roles")
def get_roles(
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_admin_role)
):
    return db.query(Role).all()
