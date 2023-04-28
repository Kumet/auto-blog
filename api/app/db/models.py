from sqlalchemy import Column, Integer, String

from db.database import Base


class SiteInfo(Base):
    __tablename__ = "site_infos"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    password = Column(String, nullable=False)
