import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services.record_service import MeetingRecordService
from app.models.record import MeetingRecord, MeetingRecordStatus


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:")
    metadata = MeetingRecord.__table__.metadata
    metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    metadata.drop_all(engine)


@pytest.fixture()
def meeting_record_service(db_session):
    return MeetingRecordService(db_session)


def test_meeting_record_service_create_and_get(meeting_record_service):
    record = meeting_record_service.create(
        course_id=1,
        tutor_id="tutor_a",
        attendees="A, B",
        discussion_points="Intro",
        status=list(MeetingRecordStatus)[0],
    )
    fetched = meeting_record_service.get_by_id(record.id)
    assert fetched is not None
    assert fetched.course_id == 1
    assert fetched.tutor_id == "tutor_a"


def test_meeting_record_service_queries(meeting_record_service):
    statuses = list(MeetingRecordStatus)
    status_a = statuses[0]
    status_b = statuses[1] if len(statuses) > 1 else statuses[0]

    r1 = meeting_record_service.create(1, "tutor_a", status=status_a)
    r2 = meeting_record_service.create(1, "tutor_b", status=status_b)
    r3 = meeting_record_service.create(2, "tutor_a", status=status_b)

    all_records = meeting_record_service.get_all()
    assert {r.id for r in all_records} == {r1.id, r2.id, r3.id}

    by_course = meeting_record_service.get_by_course(1)
    assert {r.id for r in by_course} == {r1.id, r2.id}

    by_tutor = meeting_record_service.get_by_tutor("tutor_a")
    assert {r.id for r in by_tutor} == {r1.id, r3.id}

    by_status = meeting_record_service.get_by_status(status_b)
    assert {r.id for r in by_status} == {r2.id, r3.id}


def test_meeting_record_service_update_and_delete(meeting_record_service):
    record = meeting_record_service.create(3, "tutor_c")

    updated = meeting_record_service.update(
        record_id=record.id,
        attendees="C, D",
        discussion_points="Deep dive",
        status=list(MeetingRecordStatus)[-1],
    )
    assert updated.attendees == "C, D"
    assert updated.discussion_points == "Deep dive"
    assert updated.status == list(MeetingRecordStatus)[-1]
    assert updated.updated_at is not None

    assert meeting_record_service.update(9999, attendees="Ghost") is None

    assert meeting_record_service.delete(record.id) is True
    assert meeting_record_service.get_by_id(record.id) is None
    assert meeting_record_service.delete(record.id) is False


def test_meeting_record_service_approve_and_reject(meeting_record_service):
    base_status = MeetingRecordStatus.PENDING
    record = meeting_record_service.create(4, "tutor_d", status=base_status)
    approved = meeting_record_service.approve(record.id)
    assert approved.status == MeetingRecordStatus.APPROVED

    rejected = meeting_record_service.reject(record.id)
    assert rejected.status == MeetingRecordStatus.REJECTED

    assert meeting_record_service.approve(9999) is None
    assert meeting_record_service.reject(9999) is None