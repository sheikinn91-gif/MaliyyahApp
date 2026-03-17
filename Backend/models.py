from pydantic import BaseModel

from database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False) # Dalam realiti, gunakan hash
    location = Column(String)
    occupation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class ZakatHistory(Base):
    __tablename__ = "zakat_history"

    id = Column(Integer, primary_key=True, index=True)
    pendapatan = Column(Float)
    kripto = Column(Float)
    harta = Column(Float)
    logam = Column(Float)
    total_zakat = Column(Float) # <--- PASTIKAN NAMA INI SAMA DENGAN DI main.py
    created_at = Column(DateTime, default=datetime.utcnow)
class ForgotPasswordRequest(BaseModel):
    username: str
    location: str
    new_password: str