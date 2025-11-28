import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services.enrollment_service import EnrollmentService
from app.services.course_service import CourseService, SubjectService
from app.models.course import Course, CourseStatus, Level, Subject
from app.models.enrollment import EnrollmentStatus


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
def enrollment_service(db_session):
    return EnrollmentService(db_session)


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


def test_enrollment_service_create_and_get(enrollment_service, persisted_course):
    enrollment = enrollment_service.create(
        tutee_id="tutee_one",
        course_id=persisted_course.id,
        status=list(EnrollmentStatus)[0],
    )
    fetched = enrollment_service.get_by_id(enrollment.id)
    assert fetched is not None
    assert fetched.tutee_id == "tutee_one"
    assert fetched.course_id == persisted_course.id


def test_enrollment_service_filters(
    enrollment_service, course_service, persisted_course, default_subject
):
    second_course = course_service.create(
        title="Second Course",
        tutor_id="tutor_extra",
        subject_id=default_subject.id,
        max_students=15,
    )
    statuses = list(EnrollmentStatus)
    status_a = statuses[0]
    status_b = statuses[1] if len(statuses) > 1 else statuses[0]

    enroll1 = enrollment_service.create("tutee_a", persisted_course.id, status=status_a)
    enroll2 = enrollment_service.create("tutee_b", persisted_course.id, status=status_b)
    enroll3 = enrollment_service.create("tutee_a", second_course.id, status=status_b)

    all_enrollments = enrollment_service.get_all()
    assert {e.id for e in all_enrollments} == {enroll1.id, enroll2.id, enroll3.id}

    by_tutee = enrollment_service.get_by_tutee("tutee_a")
    assert {e.id for e in by_tutee} == {enroll1.id, enroll3.id}

    by_course = enrollment_service.get_by_course(persisted_course.id)
    assert {e.id for e in by_course} == {enroll1.id, enroll2.id}

    by_status = enrollment_service.get_by_status(status_b)
    assert {e.id for e in by_status} == {enroll2.id, enroll3.id}

    mixed = enrollment_service.get_by_tutee_and_course("tutee_a", second_course.id)
    assert mixed.id == enroll3.id


def test_enrollment_service_update_and_delete(enrollment_service, persisted_course):
    enrollment = enrollment_service.create("tutee_z", persisted_course.id)
    statuses = list(EnrollmentStatus)
    new_status = statuses[-1]

    updated = enrollment_service.update(
        enrollment_id=enrollment.id,
        status=new_status,
        drop_reason="Completed",
    )
    assert updated.status == new_status
    assert updated.drop_reason == "Completed"
    assert updated.updated_at is not None

    assert enrollment_service.update(9999, drop_reason="NA") is None

    assert enrollment_service.delete(enrollment.id) is True
    assert enrollment_service.get_by_id(enrollment.id) is None
    assert enrollment_service.delete(enrollment.id) is False