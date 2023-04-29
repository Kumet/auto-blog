from sqlalchemy.orm import Session

from db import models, schemas


def create_template(db: Session, template: schemas.Template):
    db_template = models.Template(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


def get_template(db: Session, template_id: int):
    return db.query(models.Template).filter(models.Template.id == template_id).first()


def get_templates(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Template).offset(skip).limit(limit).all()


def update_template(db: Session, template_id: int, template: schemas.TemplateUpdate):
    db_template = (
        db.query(models.Template).filter(models.Template.id == template_id).first()
    )
    if not db_template:
        return None
    for key, value in template.dict().items():
        setattr(db_template, key, value)
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


def delete_template(db: Session, template_id: int):
    db_template = (
        db.query(models.Template).filter(models.Template.id == template_id).first()
    )
    if not db_template:
        return None
    db.delete(db_template)
    db.commit()
    return db_template
