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


@router.post("/site_info", response_model=schemas.SiteInfo)
def create_site_info(site_info: schemas.SiteInfoCreate, db: Session = Depends(get_db)):
    return crud.create_site_info(db=db, site_info=site_info)


@router.get("/site_info", response_model=List[schemas.SiteInfo])
def read_site_infos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_site_infos(db=db, skip=skip, limit=limit)


@router.get("/site_info/{site_info_id}", response_model=schemas.SiteInfo)
def read_site_info(site_info_id: int, db: Session = Depends(get_db)):
    site_info = crud.get_site_info(db=db, site_info_id=site_info_id)
    if site_info is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return site_info


@router.put("/site_info/{site_info_id}", response_model=schemas.SiteInfo)
def update_site_info(
    site_info_id: int, site_info: schemas.SiteInfoUpdate, db: Session = Depends(get_db)
):
    db_site_info = crud.update_site_info(
        db=db, site_info_id=site_info_id, site_info=site_info
    )
    if db_site_info is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return db_site_info


@router.delete("/site_info/{site_info_id}", response_model=schemas.SiteInfo)
def delete_item(site_info_id: int, db: Session = Depends(get_db)):
    db_site_info = crud.delete_site_info(db=db, site_info_id=site_info_id)
    if db_site_info is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return db_site_info
