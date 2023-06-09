from sqlalchemy.orm import Session

from db import models, schemas


def create_settings(db: Session, settings: schemas.SettingsCreate):
    db_settings = models.Settings(
        status=settings.status,
        model_name=settings.model_name,
        temperature=settings.temperature,
        max_tokens=settings.max_tokens,
        site_info_id=settings.site_info.id,
        template_id=settings.template.id,
    )
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings


def get_settings(db: Session, settings_id: int):
    return db.query(models.Settings).filter(models.Settings.id == settings_id).first()


def get_settingss(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Settings).offset(skip).limit(limit).all()


def update_settings(db: Session, settings_id: int, settings: schemas.SettingsUpdate):
    db_settings = (
        db.query(models.Settings).filter(models.Settings.id == settings_id).first()
    )
    if not db_settings:
        return None

    for key, value in settings.dict(exclude_unset=True).items():
        if key == "site_info":
            site_info_instance = schemas.SiteInfo(**value)
            db_settings.site_info_id = site_info_instance.id
        elif key == "template":
            template_instance = schemas.Template(**value)
            db_settings.template_id = template_instance.id
        else:
            setattr(db_settings, key, value)

    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings


def delete_settings(db: Session, settings_id: int):
    db_settings = (
        db.query(models.Settings).filter(models.Settings.id == settings_id).first()
    )
    if not db_settings:
        return None
    db.delete(db_settings)
    db.commit()
    return db_settings
