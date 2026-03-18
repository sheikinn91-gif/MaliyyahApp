import os

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv # Pastikan ini juga ada jika guna .env

# ==========================================
# 1. KONFIGURASI DATABASE (PostgreSQL)
# ==========================================
DATABASE_URL = "postgresql://postgres:910805126536@localhost:5432/maliyyah_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==========================================
# 2. MODEL DATABASE
# ==========================================
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    location = Column(String)
    occupation = Column(String)

class ZakatHistory(Base):
    __tablename__ = "zakat_history"
    id = Column(Integer, primary_key=True, index=True)
    kategori = Column(String, default="Zakat Harta")
    pendapatan = Column(Float, default=0.0)
    kripto = Column(Float, default=0.0)
    harta = Column(Float, default=0.0)
    logam = Column(Float, default=0.0)
    total_zakat = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

# Cipta jadual secara automatik
Base.metadata.create_all(bind=engine)

# ==========================================
# 3. SCHEMA PYDANTIC (Validasi Data)
# ==========================================
class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    password: str
    location: str
    occupation: str

class CalculateRequest(BaseModel):
    pendapatan: float
    kripto: float
    harta: float
    logam: float
    total_zakat: float

class ChatRequest(BaseModel):
    message: str
    user_context: Optional[dict] = None

# ==========================================
# 4. PENYEDIAAN FASTAPI & CORS
# ==========================================
app = FastAPI(title="Maliyyah API - Sabah Region")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Benarkan akses dari mana-mana origin (Frontend Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Konfigurasi AI Gemini
load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_KEY) # type: ignore

# Dependency untuk sesi database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# 5. ENDPOINTS API
# ==========================================

@app.get("/")
def read_root():
    return {"status": "Maliyyah API Aktif", "region": "Sabah, Malaysia"}

# --- AUTHENTICATION ---

@app.post("/api/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == req.username.lower()).first()
    if not db_user or db_user.password != req.password: # type: ignore
        raise HTTPException(status_code=401, detail="Nama pengguna atau kata laluan salah")
    return {
        "access_token": "maliyyah_secure_session_token",
        "user": {
            "name": db_user.username,
            "location": db_user.location,
            "occupation": db_user.occupation
        }
    }

@app.post("/api/signup")
async def signup(req: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == req.username.lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username sudah berdaftar")
    
    new_user = User(
        username=req.username.lower(),
        password=req.password,
        location=req.location,
        occupation=req.occupation
    )
    db.add(new_user)
    db.commit()
    return {"message": "Akaun berjaya dicipta"}

# --- MARKET DATA ---
@app.get("/api/live-market")
async def get_live_market():
    # Data statik sebagai fallback (boleh diganti dengan API real-time nanti)
    return {"btc": 295000.0, "gold_gram": 385.50, "silver_gram": 4.60}

# --- ZAKAT CORE LOGIC ---

@app.post("/api/calculate")
async def calculate_zakat(req: CalculateRequest, db: Session = Depends(get_db)):
    try:
        zakat_val = round(req.total_zakat, 2)
        
        # Logik penentuan kategori secara dinamik
        kat = "Zakat Harta"
        if req.pendapatan > 0: kat = "Pendapatan"
        elif req.kripto > 0: kat = "Kripto"
        elif req.logam > 0: kat = "Logam/Emas"

        new_history = ZakatHistory(
            kategori=kat,
            pendapatan=req.pendapatan,
            kripto=req.kripto,
            harta=req.harta,
            logam=req.logam,
            total_zakat=zakat_val
        )
        db.add(new_history)
        db.commit()
        db.refresh(new_history)
        return {"status": "success", "total_zakat": zakat_val, "data": new_history}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/zakat-summary")
async def get_summary(db: Session = Depends(get_db)):
    # Kira jumlah mengikut kategori spesifik
    pendapatan = db.query(func.sum(ZakatHistory.total_zakat)).filter(ZakatHistory.kategori == "Pendapatan").scalar() or 0
    kripto = db.query(func.sum(ZakatHistory.total_zakat)).filter(ZakatHistory.kategori == "Kripto").scalar() or 0
    harta = db.query(func.sum(ZakatHistory.total_zakat)).filter(ZakatHistory.kategori == "Zakat Harta").scalar() or 0
    logam = db.query(func.sum(ZakatHistory.total_zakat)).filter(ZakatHistory.kategori == "Logam/Emas").scalar() or 0
    
    # Jumlah besar (Grand Total)
    total_all = db.query(func.sum(ZakatHistory.total_zakat)).scalar() or 0
    
    return {
        "pendapatan": round(float(pendapatan), 2),
        "kripto": round(float(kripto), 2),
        "harta": round(float(harta), 2),
        "logam": round(float(logam), 2),
        "total_keseluruhan": round(float(total_all), 2)
    }

@app.get("/api/history")
async def get_history(limit: int = 15, db: Session = Depends(get_db)):
    return db.query(ZakatHistory).order_by(ZakatHistory.created_at.desc()).limit(limit).all()

# --- ENDPOINT RESET: PADAM SEMUA DATA ---
@app.delete("/api/history")
async def reset_history(db: Session = Depends(get_db)):
    try:
        # ARAHAN: Padam semua baris dalam jadual zakat_history
        db.query(ZakatHistory).delete()
        db.commit()
        return {"message": "Database berjaya dikosongkan secara total"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ralat sistem: {str(e)}")

# --- AI CHAT ASSISTANT ---
@app.post("/api/ai-chat")
async def chat_with_ai(request: ChatRequest):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash') # type: ignore
        ctx = request.user_context or {}
        name = ctx.get("name", "Pengguna")
        loc = ctx.get("location", "Sabah")
        job = ctx.get("occupation", "Full-Stack Developer")

        sys_prompt = (
            f"Nama anda adalah Maliyyah AI. Anda pakar zakat di {loc}. "
            f"Anda sedang membantu {name} ({job}). "
            "Berikan jawapan ringkas, padat, dan gunakan Bahasa Melayu yang sopan."
        )
        
        full_query = f"{sys_prompt}\n\nUser Question: {request.message}"
        response = model.generate_content(full_query)
        return {"reply": response.text}
    except Exception:
        return {"reply": "Maaf, buat masa ini saya tidak dapat menjawab. Sila cuba sebentar lagi."}

# ==========================================
# 6. RUN SERVER
# ==========================================
if __name__ == "__main__":
    import uvicorn
    # Pastikan uvicorn dipasang: pip install uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)