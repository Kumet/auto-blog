from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from db.database import Base


class SiteInfo(Base):
    __tablename__ = "site_infos"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    password = Column(String, nullable=False)


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    label = Column(String, nullable=False)


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)
    max_tokens = Column(Integer, nullable=False)

    site_info_id = Column(Integer, ForeignKey("site_infos.id"))
    site_info = relationship("SiteInfo", back_populates="settings")

    template_id = Column(Integer, ForeignKey("templates.id"))
    template = relationship("Template", back_populates="settings")


SiteInfo.settings = relationship("Settings", back_populates="site_info", uselist=False)
Template.settings = relationship("Settings", back_populates="template", uselist=False)
