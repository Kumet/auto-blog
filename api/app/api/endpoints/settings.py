from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import crud, database, schemas

router = APIRouter()


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/settings", response_model=schemas.Settings)
def create_settings(settings: schemas.SettingsCreate, db: Session = Depends(get_db)):
    return crud.create_settings(db=db, settings=settings)


@router.get("/settings", response_model=List[schemas.Settings])
def read_settingss(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_settingss(db=db, skip=skip, limit=limit)


@router.get("/settings/{settings_id}", response_model=schemas.Settings)
def read_settings(settings_id: int, db: Session = Depends(get_db)):
    settings = crud.get_settings(db=db, settings_id=settings_id)
    if settings is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return settings


@router.put("/settings/{settings_id}", response_model=schemas.Settings)
def update_settings(
    settings_id: int, settings: schemas.SettingsUpdate, db: Session = Depends(get_db)
):
    db_settings = crud.update_settings(
        db=db, settings_id=settings_id, settings=settings
    )
    if db_settings is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return db_settings


@router.delete("/settings/{settings_id}", response_model=schemas.Settings)
def delete_item(settings_id: int, db: Session = Depends(get_db)):
    db_settings = crud.delete_settings(db=db, settings_id=settings_id)
    if db_settings is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return db_settings
