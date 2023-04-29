from pydantic import BaseModel


class SiteInfoBase(BaseModel):
    url: str
    user_name: str
    password: str


class SiteInfoCreate(SiteInfoBase):
    pass


class SiteInfoUpdate(SiteInfoBase):
    pass


class SiteInfo(SiteInfoBase):
    id: int

    class Config:
        orm_mode = True
