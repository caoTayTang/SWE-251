from sqlalchemy.orm import Session, sessionmaker
from typing import List, Optional
from ..models.user import MuSession, UserRole


class SessionService:
    def __init__(self, db_session: sessionmaker):
        self.db_session = db_session

    def get_by_session_id(self, ss_id: str) -> Optional[MuSession]:
        db = self.db_session()
        result = db.query(MuSession).filter(MuSession.session_id == ss_id).first()
        db.close()
        return result