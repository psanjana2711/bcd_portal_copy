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
    contact_person: str
    email: EmailStr
    address: Optional[str] = None

class HospitalCreate(HospitalBase):
    pass

class HospitalResponse(HospitalBase):
    id: int

    class Config:
        from_attributes = True

class LanguageResponse(BaseModel):
    code: str
    name: str

    class Config:
        from_attributes = True

class QuestionOptionResponse(BaseModel):
    id: int
    option_value: str
    option_label: str
    sort_order: int

    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    id: int
    section: str
    response_type: str
    question_text: str
    parent_question_id: Optional[int] = None
    trigger_answer: Optional[str] = None
    options: list[QuestionOptionResponse] = []

    class Config:
        from_attributes = True
