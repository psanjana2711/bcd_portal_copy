import sys
import os
# When running this file directly (not as a package), ensure the repository
# root is on `sys.path` so absolute imports like `backend.src...` work.
if __package__ is None:
    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    if repo_root not in sys.path:
        sys.path.insert(0, repo_root)
from sqlalchemy.orm import Session
from backend.src.db import session as db_session
from backend.src.models import models
from backend.src.core.security import get_password_hash
from sqlalchemy.exc import OperationalError
from sqlalchemy import text

def seed_data():
    try:
        db = db_session.SessionLocal()
        # quick connectivity check
        db.execute(text("SELECT 1"))
    except Exception as e:
        print("Could not connect to configured DB:", e)
        print("Seeding requires a reachable database. Options:\n - configure a reachable MySQL in .env\n - run a local MySQL and point MYSQL_HOST to it\n - or run the script from the repo root with PYTHONPATH set")
        print("Example: PYTHONPATH=$(pwd) python3 backend/src/seed.py")
        return
    try:
        # 1. Create Hospital
        hospital = db.query(models.Hospital).filter(models.Hospital.name == "Test1").first()
        if not hospital:
            hospital = models.Hospital(
                name="Test1",
                contact_person="Ashwin RaajKumar",
                email="ashwin.rajkumar@tanuh.ai",
                address="TANUH Foundation, Indian Institute of Science, Bengaluru"
            )
            db.add(hospital)
            db.commit()
            db.refresh(hospital)
            print(f"Hospital created: {hospital.name}")
        else:
            print("Hospital already exists")

        # 2. Create Roles
        roles = ["Admin", "Doctor", "Staff"]
        for role_name in roles:
            role = db.query(models.Role).filter(models.Role.name == role_name).first()
            if not role:
                role = models.Role(name=role_name)
                db.add(role)
                print(f"Role created: {role_name}")
        db.commit()

        # 3. Create a Test User
        doctor_role = db.query(models.Role).filter(models.Role.name == "Staff").first()
        test_user = db.query(models.User).filter(models.User.email == "breastcancerdetection@tanuh.ai").first()
        if not test_user:
            test_user = models.User(
                email="breastcancerdetection@tanuh.ai",
                password_hash=get_password_hash("BestWishes26"),
                full_name="Test person",
                hospital_id=hospital.id,
                role_id=doctor_role.id,
                is_active=True
            )
            db.add(test_user)
            db.commit()
            print(f"Test user created: {test_user.email}")
        else:
            print("Test user already exists")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
