from sqlalchemy import Column, Integer, String, Text

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
