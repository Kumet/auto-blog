from typing import Literal

from pydantic import BaseModel
from db.schemas.site_info import SiteInfo
from db.schemas.template import Template


class SettingsBase(BaseModel):
    site_info: SiteInfo
    status: Literal["check", "draft", "publish"]
    model_name: str
    temperature: float
    max_tokens: int
    template: Template


class SettingsCreate(BaseModel):
    pass


class SettingsUpdate(BaseModel):
    pass


class Settings(SettingsBase):
    id: int

    class Config:
        orm_mode = True
