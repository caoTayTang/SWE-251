import pytest
from datetime import date, time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services.course_service import CourseService, CourseSessionService, SubjectService
from app.models.course import Course, CourseStatus, Level, CourseFormat, Subject


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:")
    metadata = Course.__table__.metadata
    metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    metadata.drop_all(engine)


@pytest.fixture()
def subject_service(db_session):
    return SubjectService(db_session)


@pytest.fixture()
def course_service(db_session):
    return CourseService(db_session)


@pytest.fixture()
def course_session_service(db_session):
    return CourseSessionService(db_session)


@pytest.fixture()
def default_subject(subject_service):
    return subject_service.create(id=1, name="Mathematics")


@pytest.fixture()
def persisted_course(course_service, default_subject):
    return course_service.create(
        title="Persistent Course",
        tutor_id="tutor_main",
        subject_id=default_subject.id,
        max_students=25,
        description="Base course",
    )


def test_course_service_create_and_get_by_id(course_service, default_subject):
    created = course_service.create(
        title="Physics 101",
        tutor_id="tutor_a",
        subject_id=default_subject.id,
        max_students=30,
        description="Intro physics",
        cover_image_url="http://example.com/cover",
        level=list(Level)[0],
        status=list(CourseStatus)[0],
    )
    fetched = course_service.get_by_id(created.id)
    assert fetched is not None
    assert fetched.title == "Physics 101"
    assert fetched.subject_id == default_subject.id


def test_course_service_filters(course_service, subject_service, default_subject):
    other_subject = subject_service.create(id=2, name="Chemistry")
    statuses = list(CourseStatus)
    levels = list(Level)
    status_a = statuses[0]
    status_b = statuses[1] if len(statuses) > 1 else statuses[0]
    level_a = levels[0]
    level_b = levels[1] if len(levels) > 1 else levels[0]

    course1 = course_service.create(
        title="Course A",
        tutor_id="tutor_a",
        subject_id=default_subject.id,
        max_students=20,
        level=level_a,
        status=status_a,
    )
    course2 = course_service.create(
        title="Course B",
        tutor_id="tutor_b",
        subject_id=other_subject.id,
        max_students=15,
        level=level_b,
        status=status_b,
    )
    course3 = course_service.create(
        title="Course C",
        tutor_id="tutor_a",
        subject_id=default_subject.id,
        max_students=10,
        level=level_a,
        status=status_a,
    )

    tutor_courses = course_service.get_by_tutor("tutor_a")
    assert {c.id for c in tutor_courses} == {course1.id, course3.id}

    subject_courses = course_service.get_by_subject(other_subject.id)
    assert [c.id for c in subject_courses] == [course2.id]

    status_courses = course_service.get_by_status(status_b)
    expected_status_ids = {c.id for c in (course1, course2, course3) if c.status == status_b}
    assert {c.id for c in status_courses} == expected_status_ids

    level_courses = course_service.get_by_level(level_a)
    expected_level_ids = {c.id for c in (course1, course2, course3) if c.level == level_a}
    assert {c.id for c in level_courses} == expected_level_ids

    paged_courses = course_service.get_all(skip=1, limit=1)
    assert len(paged_courses) == 1


def test_course_service_update_and_delete(course_service, default_subject):
    course = course_service.create(
        title="Original",
        tutor_id="tutor_c",
        subject_id=default_subject.id,
        max_students=40,
    )
    updated = course_service.update(
        course_id=course.id,
        title="Updated",
        description="Updated description",
        max_students=35,
    )
    assert updated.title == "Updated"
    assert updated.description == "Updated description"
    assert updated.max_students == 35
    assert updated.updated_at is not None

    assert course_service.update(course_id=9999, title="Nope") is None

    assert course_service.delete(course.id) is True
    assert course_service.get_by_id(course.id) is None
    assert course_service.delete(course.id) is False


def test_course_session_service_crud(course_session_service, persisted_course):
    formats = list(CourseFormat)
    format_a = formats[0]
    format_b = formats[1] if len(formats) > 1 else formats[0]

    session1 = course_session_service.create(
        course_id=persisted_course.id,
        session_number=1,
        session_date=date(2024, 1, 1),
        start_time=time(9, 0),
        end_time=time(10, 0),
        format=format_a,
        location="Room 1",
    )
    session2 = course_session_service.create(
        course_id=persisted_course.id,
        session_number=2,
        session_date=date(2024, 1, 2),
        start_time=time(10, 0),
        end_time=time(11, 0),
        format=format_b,
        location="Room 2",
    )

    fetched = course_session_service.get_by_id(session1.id)
    assert fetched.session_number == 1

    by_course = course_session_service.get_by_course(persisted_course.id)
    assert [s.session_number for s in by_course] == [1, 2]

    by_date = course_session_service.get_by_date(date(2024, 1, 1))
    assert [s.id for s in by_date] == [session1.id]

    by_format = course_session_service.get_by_format(format_b)
    expected_format_ids = {s.id for s in (session1, session2) if s.format == format_b}
    assert {s.id for s in by_format} == expected_format_ids

    updated = course_session_service.update(
        session_id=session1.id,
        session_number=3,
        location="Room 3",
    )
    assert updated.session_number == 3
    assert updated.location == "Room 3"

    assert course_session_service.update(session_id=9999, location="NA") is None

    assert course_session_service.delete(session2.id) is True
    assert course_session_service.delete(session2.id) is False


def test_subject_service_crud(subject_service):
    created = subject_service.create(id=10, name="Biology")
    assert subject_service.get_by_id(10).name == "Biology"
    assert subject_service.get_by_name("Biology").id == 10

    updated = subject_service.update(10, name="Advanced Biology")
    assert updated.name == "Advanced Biology"

    assert subject_service.update(9999, name="Ghost") is None

    assert subject_service.delete(10) is True
    assert subject_service.delete(10) is False