from pydantic import BaseModel


class TemplateBase(BaseModel):
    content: str
    label: str


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(TemplateBase):
    pass


class Template(TemplateBase):
    id: int

    class Config:
        orm_mode = True
