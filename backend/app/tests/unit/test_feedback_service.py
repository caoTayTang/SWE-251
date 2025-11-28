import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services.feedback_service import FeedbackService, SessionEvaluationService
from app.models.feedback import Feedback, SessionEvaluation


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:")
    metadata = Feedback.__table__.metadata
    metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    metadata.drop_all(engine)


@pytest.fixture()
def feedback_service(db_session):
    return FeedbackService(db_session)


@pytest.fixture()
def evaluation_service(db_session):
    return SessionEvaluationService(db_session)


def test_feedback_service_create_and_get(feedback_service):
    fb = feedback_service.create(
        user_id="user_a",
        topic="UX",
        content="Great UI",
        is_anonymous=False,
    )
    fetched = feedback_service.get_by_id(fb.id)
    assert fetched is not None
    assert fetched.topic == "UX"
    assert fetched.user_id == "user_a"


def test_feedback_service_filters(feedback_service):
    fb1 = feedback_service.create("user_a", "UX", "Nice", False)
    fb2 = feedback_service.create("user_b", "Bug", "Issue", True)
    fb3 = feedback_service.create("user_a", "Bug", "Crash", True)

    all_items = feedback_service.get_all()
    assert {f.id for f in all_items} == {fb1.id, fb2.id, fb3.id}

    by_user = feedback_service.get_by_user("user_a")
    assert {f.id for f in by_user} == {fb1.id, fb3.id}

    by_topic = feedback_service.get_by_topic("Bug")
    assert {f.id for f in by_topic} == {fb2.id, fb3.id}

    anonymous = feedback_service.get_anonymous()
    assert {f.id for f in anonymous} == {fb2.id, fb3.id}


def test_feedback_service_update_and_delete(feedback_service):
    fb = feedback_service.create("user_c", "Course", "Okay", False)

    updated = feedback_service.update(
        feedback_id=fb.id,
        topic="Course Updated",
        content="Better",
        is_anonymous=True,
    )
    assert updated.topic == "Course Updated"
    assert updated.content == "Better"
    assert updated.is_anonymous is True
    assert updated.updated_at is not None

    assert feedback_service.update(9999, topic="NA") is None

    assert feedback_service.delete(fb.id) is True
    assert feedback_service.get_by_id(fb.id) is None
    assert feedback_service.delete(fb.id) is False


def test_session_evaluation_service_create_and_get(evaluation_service):
    ev = evaluation_service.create(
        session_id=1,
        enrollment_id=10,
        rating=5,
        comment="Excellent",
        is_anonymous=False,
    )
    fetched = evaluation_service.get_by_id(ev.id)
    assert fetched is not None
    assert fetched.rating == 5
    assert fetched.session_id == 1


def test_session_evaluation_service_filters(evaluation_service):
    ev1 = evaluation_service.create(1, 10, 5, "Great", False)
    ev2 = evaluation_service.create(1, 11, 3, "Average", True)
    ev3 = evaluation_service.create(2, 11, 3, "Still 3", True)

    all_items = evaluation_service.get_all()
    assert {e.id for e in all_items} == {ev1.id, ev2.id, ev3.id}

    by_session = evaluation_service.get_by_session(1)
    assert {e.id for e in by_session} == {ev1.id, ev2.id}

    by_enrollment = evaluation_service.get_by_enrollment(11)
    assert {e.id for e in by_enrollment} == {ev2.id, ev3.id}

    by_rating = evaluation_service.get_by_rating(3)
    assert {e.id for e in by_rating} == {ev2.id, ev3.id}

    anonymous = evaluation_service.get_anonymous()
    assert {e.id for e in anonymous} == {ev2.id, ev3.id}


def test_session_evaluation_service_update_and_delete(evaluation_service):
    ev = evaluation_service.create(3, 99, 2, "Needs work", False)

    updated = evaluation_service.update(
        evaluation_id=ev.id,
        rating=4,
        comment="Improved",
        is_anonymous=True,
    )
    assert updated.rating == 4
    assert updated.comment == "Improved"
    assert updated.is_anonymous is True
    assert updated.updated_at is not None

    assert evaluation_service.update(9999, rating=1) is None

    assert evaluation_service.delete(ev.id) is True
    assert evaluation_service.get_by_id(ev.id) is None
    assert evaluation_service.delete(ev.id) is False