from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..models.models import PatientSession, Question, QuestionTranslation, QuestionOption, QuestionOptionTranslation
from ..schemas.schemas import QuestionResponse, QuestionOptionResponse
from ..core.config import settings
from .auth import get_current_user
from google.cloud import storage
from typing import List
import uuid
import datetime
import pytz

router = APIRouter()

def get_ist_now():
    return datetime.datetime.now(pytz.timezone('Asia/Kolkata'))

def upload_to_gcs(file_content, destination_blob_name):
    if not settings.GCP_STORAGE_BUCKET:
        raise Exception("GCP_STORAGE_BUCKET not configured")
    
    if settings.GOOGLE_APPLICATION_CREDENTIALS and settings.GOOGLE_APPLICATION_CREDENTIALS.strip():
        storage_client = storage.Client.from_service_account_json(settings.GOOGLE_APPLICATION_CREDENTIALS)
    else:
        storage_client = storage.Client()
        
    bucket = storage_client.bucket(settings.GCP_STORAGE_BUCKET)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_string(file_content, content_type="application/octet-stream")
    return f"gs://{settings.GCP_STORAGE_BUCKET}/{destination_blob_name}"

@router.get("/questions", response_model=List[QuestionResponse])
def get_questions(lang: str = "en", db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    
    response = []
    for q in questions:
        # Get translation for the question
        trans = db.query(QuestionTranslation).filter(
            QuestionTranslation.question_id == q.id,
            QuestionTranslation.language_code == lang
        ).first()
        
        # Fallback to English if translation not found
        if not trans and lang != "en":
             trans = db.query(QuestionTranslation).filter(
                QuestionTranslation.question_id == q.id,
                QuestionTranslation.language_code == "en"
            ).first()
        
        if not trans:
            continue
            
        options = []
        for opt in q.options:
            opt_trans = db.query(QuestionOptionTranslation).filter(
                QuestionOptionTranslation.option_id == opt.id,
                QuestionOptionTranslation.language_code == lang
            ).first()
            
            # Fallback to English
            if not opt_trans and lang != "en":
                opt_trans = db.query(QuestionOptionTranslation).filter(
                    QuestionOptionTranslation.option_id == opt.id,
                    QuestionOptionTranslation.language_code == "en"
                ).first()
            
            if opt_trans:
                options.append(QuestionOptionResponse(
                    id=opt.id,
                    option_value=opt.option_value,
                    option_label=opt_trans.option_label,
                    sort_order=opt.sort_order
                ))
        
        response.append(QuestionResponse(
            id=q.id,
            section=q.section,
            response_type=q.response_type,
            question_text=trans.question_text,
            parent_question_id=q.parent_question_id,
            trigger_answer=q.trigger_answer,
            options=sorted(options, key=lambda x: x.sort_order)
        ))
    
    return response

@router.post("/consent")
async def upload_consent(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        hospital_id = current_user.get("hospital_id")
        if not hospital_id:
             raise HTTPException(status_code=400, detail="User hospital ID not found")

        content = await file.read()
        
        # Create a unique filename
        ist_now = get_ist_now()
        timestamp = ist_now.strftime("%Y%m%d_%H%M%S")
        unique_id = uuid.uuid4().hex[:8]
        extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        destination_blob_name = f"consents/{hospital_id}/{timestamp}_{unique_id}.{extension}"
        
        gcs_url = upload_to_gcs(content, destination_blob_name)
        
        # Save to DB
        new_session = PatientSession(
            hospital_id=hospital_id,
            consent_scanned_url=gcs_url,
            consent_timestamp=ist_now
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        
        return {"id": new_session.id, "consent_scanned_url": gcs_url}
        
    except Exception as e:
        print(f"Error uploading consent: {e}")
        error_detail = str(e)
        if "403" in error_detail:
            error_detail = "Permission denied: Service account does not have write access to GCS bucket."
        elif "not configured" in error_detail:
            error_detail = "GCS bucket is not configured in settings."
            
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not upload consent: {error_detail}"
        )
