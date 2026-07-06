from fastapi import APIRouter
from backend.app.data_loader import load_satellites, load_debris

router = APIRouter(prefix="/api", tags=["satellites"])


@router.get("/satellites")
def list_satellites(limit: int = 100):
    df = load_satellites()
    return df.head(limit).to_dict(orient="records")


@router.get("/debris")
def list_debris(limit: int = 100):
    df = load_debris()
    return df.head(limit).to_dict(orient="records")
