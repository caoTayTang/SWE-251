from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..models.feedback import Feedback, SessionEvaluation


class FeedbackService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: str, topic: str, content: str, 
               is_anonymous: bool = False) -> Feedback:
        feedback = Feedback(
            user_id=user_id,
            topic=topic,
            content=content,
            is_anonymous=is_anonymous
        )
        self.db.add(feedback)
        self.db.commit()
        self.db.refresh(feedback)
        return feedback

    def get_by_id(self, feedback_id: int) -> Optional[Feedback]:
        return self.db.query(Feedback).filter(Feedback.id == feedback_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Feedback]:
        return self.db.query(Feedback).offset(skip).limit(limit).all()

    def get_by_user(self, user_id: str) -> List[Feedback]:
        return self.db.query(Feedback).filter(Feedback.user_id == user_id).all()

    def get_by_topic(self, topic: str) -> List[Feedback]:
        return self.db.query(Feedback).filter(Feedback.topic == topic).all()

    def get_anonymous(self) -> List[Feedback]:
        return self.db.query(Feedback).filter(Feedback.is_anonymous == True).all()

    def update(self, feedback_id: int, topic: Optional[str] = None,
               content: Optional[str] = None, is_anonymous: Optional[bool] = None) -> Optional[Feedback]:
        feedback = self.get_by_id(feedback_id)
        if not feedback:
            return None
        
        if topic is not None:
            feedback.topic = topic
        if content is not None:
            feedback.content = content
        if is_anonymous is not None:
            feedback.is_anonymous = is_anonymous
        
        feedback.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(feedback)
        return feedback

    def delete(self, feedback_id: int) -> bool:
        feedback = self.get_by_id(feedback_id)
        if not feedback:
            return False
        
        self.db.delete(feedback)
        self.db.commit()
        return True
    
class SessionEvaluationService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, session_id: int, enrollment_id: int, rating: int,
               comment: Optional[str] = None, is_anonymous: bool = False) -> SessionEvaluation:
        evaluation = SessionEvaluation(
            session_id=session_id,
            enrollment_id=enrollment_id,
            rating=rating,
            comment=comment,
            is_anonymous=is_anonymous
        )
        self.db.add(evaluation)
        self.db.commit()
        self.db.refresh(evaluation)
        return evaluation

    def get_by_id(self, evaluation_id: int) -> Optional[SessionEvaluation]:
        return self.db.query(SessionEvaluation).filter(SessionEvaluation.id == evaluation_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[SessionEvaluation]:
        return self.db.query(SessionEvaluation).offset(skip).limit(limit).all()

    def get_by_session(self, session_id: int) -> List[SessionEvaluation]:
        return self.db.query(SessionEvaluation).filter(SessionEvaluation.session_id == session_id).all()

    def get_by_enrollment(self, enrollment_id: int) -> List[SessionEvaluation]:
        return self.db.query(SessionEvaluation).filter(SessionEvaluation.enrollment_id == enrollment_id).all()

    def get_by_rating(self, rating: int) -> List[SessionEvaluation]:
        return self.db.query(SessionEvaluation).filter(SessionEvaluation.rating == rating).all()

    def get_anonymous(self) -> List[SessionEvaluation]:
        return self.db.query(SessionEvaluation).filter(SessionEvaluation.is_anonymous == True).all()

    def update(self, evaluation_id: int, rating: Optional[int] = None,
               comment: Optional[str] = None, is_anonymous: Optional[bool] = None) -> Optional[SessionEvaluation]:
        evaluation = self.get_by_id(evaluation_id)
        if not evaluation:
            return None
        
        if rating is not None:
            evaluation.rating = rating
        if comment is not None:
            evaluation.comment = comment
        if is_anonymous is not None:
            evaluation.is_anonymous = is_anonymous
        
        evaluation.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(evaluation)
        return evaluation

    def delete(self, evaluation_id: int) -> bool:
        evaluation = self.get_by_id(evaluation_id)
        if not evaluation:
            return False
        
        self.db.delete(evaluation)
        self.db.commit()
        return True