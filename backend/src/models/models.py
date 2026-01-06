from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, TIMESTAMP, text, Text, Enum
from sqlalchemy.orm import relationship
from ..db.session import Base
import enum

class QuestionResponseType(str, enum.Enum):
    text_field = "text_field"
    option = "option"
    numbers_only = "numbers_only"

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

class Language(Base):
    __tablename__ = "languages"

    code = Column(String(5), primary_key=True)
    name = Column(String(50), nullable=False)

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    section = Column(String(100))
    response_type = Column(Enum("text_field", "option", "numbers_only"), nullable=False)
    parent_question_id = Column(Integer, ForeignKey("questions.id"), nullable=True)
    trigger_answer = Column(String(255), nullable=True)

    translations = relationship("QuestionTranslation", back_populates="question")
    options = relationship("QuestionOption", back_populates="question")

class QuestionTranslation(Base):
    __tablename__ = "question_translations"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    language_code = Column(String(5), ForeignKey("languages.code"), nullable=False)
    question_text = Column(Text, nullable=False)

    question = relationship("Question", back_populates="translations")

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    option_value = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0)

    question = relationship("Question", back_populates="options")
    translations = relationship("QuestionOptionTranslation", back_populates="option")

class QuestionOptionTranslation(Base):
    __tablename__ = "question_option_translations"

    id = Column(Integer, primary_key=True, index=True)
    option_id = Column(Integer, ForeignKey("question_options.id", ondelete="CASCADE"), nullable=False)
    language_code = Column(String(5), ForeignKey("languages.code"), nullable=False)
    option_label = Column(Text, nullable=False)

    option = relationship("QuestionOption", back_populates="translations")

class PatientSession(Base):
    __tablename__ = "patient_sessions"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    consent_scanned_url = Column(Text)
    consent_timestamp = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    hospital = relationship("Hospital")
