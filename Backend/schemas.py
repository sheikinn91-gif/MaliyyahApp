from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ZakatCreate(BaseModel):
    user_name: str
    occupation: str
    location: str
    pendapatan: float
    kripto: float
    harta: float
    logam: float
    total_zakat: float

class ZakatResponse(ZakatCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserSignup(BaseModel):
    username: str
    password: str
    location: str
    occupation: str