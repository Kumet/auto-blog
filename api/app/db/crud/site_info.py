from sqlalchemy.orm import Session

from db import models, schemas


def create_site_info(db: Session, site_info: schemas.SiteInfoCreate):
    db_site_info = models.SiteInfo(**site_info.dict())
    db.add(db_site_info)
    db.commit()
    db.refresh(db_site_info)
    return db_site_info


def get_site_info(db: Session, site_info_id: int):
    return db.query(models.SiteInfo).filter(models.SiteInfo.id == site_info_id).first()


def get_site_infos(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.SiteInfo).offset(skip).limit(limit).all()


def update_site_info(db: Session, site_info_id: int, site_info: schemas.SiteInfoUpdate):
    db_site_info = (
        db.query(models.SiteInfo).filter(models.SiteInfo.id == site_info_id).first()
    )
    if not db_site_info:
        return None
    for key, value in site_info.dict().items():
        setattr(db_site_info, key, value)
    db.add(db_site_info)
    db.commit()
    db.refresh(db_site_info)
    return db_site_info


def delete_site_info(db: Session, site_info_id: int):
    db_site_info = (
        db.query(models.SiteInfo).filter(models.SiteInfo.id == site_info_id).first()
    )
    if not db_site_info:
        return None
    db.delete(db_site_info)
    db.commit()
    return db_site_info
