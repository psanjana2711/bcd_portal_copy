from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from ..core.config import settings

if settings.USE_SERVICE_ACCOUNT_DB:
    try:
        from db_service_account_access.connect_via_sa import get_connection

        def _sa_creator():
            return get_connection(database=settings.MYSQL_DB)

        engine = create_engine(
            "mysql+pymysql://",
            creator=_sa_creator,
            poolclass=NullPool,
        )
    except ImportError:
        raise ImportError(
            "Cloud SQL connector dependencies are missing. "
            "Install cloud-sql-python-connector[pymysql] and ensure the package is available."
        )
else:
    engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
