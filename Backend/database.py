import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Muat fail .env
load_dotenv()

# 2. Ambil URL menggunakan kurungan petak []
# Jika DATABASE_URL tiada dalam .env, Python akan keluarkan KeyError yang jelas
SQLALCHEMY_DATABASE_URL = os.environ["DATABASE_URL"]
print(f"DEBUG: Connecting to -> {SQLALCHEMY_DATABASE_URL}") # Lihat ini di terminal!

# 3. Bina Engine SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 4. Konfigurasi Sesi
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Base class untuk Models
Base = declarative_base()

# 6. Dependency untuk FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()