from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, TIMESTAMP, text, Text
from sqlalchemy.orm import relationship
from ..db.session import Base

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    contact_person = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    address = Column(Text)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    users = relationship("User", back_populates="hospital")

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)

    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    role_id = Column(Integer, ForeignKey("roles.id"))
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)

    hospital = relationship("Hospital", back_populates="users")
    role = relationship("Role", back_populates="users")
