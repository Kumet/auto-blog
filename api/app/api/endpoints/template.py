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


@router.post("/template", response_model=schemas.Template)
def create_template(template: schemas.TemplateCreate, db: Session = Depends(get_db)):
    return crud.create_template(db=db, template=template)


@router.get("/template", response_model=List[schemas.Template])
def read_templates(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_templates(db=db, skip=skip, limit=limit)


@router.get("/template/{template_id}", response_model=schemas.Template)
def read_template(template_id: int, db: Session = Depends(get_db)):
    template = crud.get_template(db=db, template_id=template_id)
    if template is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return template


@router.put("/template/{template_id}", response_model=schemas.Template)
def update_template(
    template_id: int, template: schemas.TemplateUpdate, db: Session = Depends(get_db)
):
    db_template = crud.update_template(
        db=db, template_id=template_id, template=template
    )
    if db_template is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return db_template


@router.delete("/template/{template_id}", response_model=schemas.Template)
def delete_item(template_id: int, db: Session = Depends(get_db)):
    db_template = crud.delete_template(db=db, template_id=template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Site info not found")
    return db_template
