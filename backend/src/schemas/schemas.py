from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    hospital_id: int
    role_id: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    hospital_id: Optional[int] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    hospital_name: str
    role: str
    email: EmailStr
    password: str

class HospitalBase(BaseModel):
    name: str

class HospitalResponse(HospitalBase):
    id: int

    class Config:
        from_attributes = True
