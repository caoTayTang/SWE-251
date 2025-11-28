import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app import create_app
from app.core.database import get_db, engine, SessionLocal
from app.models.base import Base
from app.models.course import Course, CourseSession, Subject, Level, CourseStatus, CourseFormat

# =========================
# === Test DB & Client ===
# =========================


def override_get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Tạo/droptable dùng chính engine của app.core.database
def setup_module():
    Base.metadata.create_all(bind=engine)


def teardown_module():
    Base.metadata.drop_all(bind=engine)


def _create_app():
    app = create_app()
    app.dependency_overrides[get_db] = override_get_db
    return app


# Fixtures đơn giản
def get_client():
    app = _create_app()
    return TestClient(app)


def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================
# === Course helpers ===
# =====================

def _course_payload(subject_id: int, title: str = "Course API 101"):
    return {
        "title": title,
        "tutor_id": "tutor_api",
        "subject_id": subject_id,
        "max_students": 30,
        "description": "Integration test course",
        "cover_image_url": "http://example.com/cover",
        "level": Level.BEGINNER.value if hasattr(Level, "BEGINNER") else None,
        "status": CourseStatus.PENDING.value if hasattr(CourseStatus, "PENDING") else None,
    }


def _session_payload(course_id: int, session_number: int = 1):
    return {
        "course_id": course_id,
        "session_number": session_number,
        "session_date": "2025-01-01",
        "start_time": "09:00:00",
        "end_time": "10:00:00",
        "format": CourseFormat.ONLINE.value if hasattr(CourseFormat, "ONLINE") else list(CourseFormat)[0].value,
        "location": "Room 101",
    }


# ==========================
# === Course CRUD tests ===
# ==========================

def test_course_create_and_get_by_id_integration():
    client = get_client()
    db = next(get_db_session())

    # chuẩn bị subject
    subject = db.query(Subject).first()
    if not subject:
        subject = Subject(id=1, name="Mathematics")
        db.add(subject)
        db.commit()
        db.refresh(subject)

    resp = client.post("/api/courses", json=_course_payload(subject.id))
    assert resp.status_code in (200, 201)
    data = resp.json()
    course_id = data["id"]

    course_db = db.query(Course).filter(Course.id == course_id).first()
    assert course_db is not None
    assert course_db.title == "Course API 101"
    assert course_db.subject_id == subject.id


def test_course_filters_integration():
    client = get_client()
    db = next(get_db_session())

    subject = db.query(Subject).first()
    if not subject:
        subject = Subject(id=1, name="Mathematics")
        db.add(subject)
        db.commit()
        db.refresh(subject)

    client.post("/api/courses", json=_course_payload(subject.id, "Course A"))
    payload_b = _course_payload(subject.id, "Course B")
    payload_b["tutor_id"] = "tutor_other"
    client.post("/api/courses", json=payload_b)

    resp_tutor = client.get("/api/tutor/courses", params={"tutor_id": "tutor_api"})
    assert resp_tutor.status_code == 200
    titles = {c["title"] for c in resp_tutor.json()}
    assert "Course A" in titles

    resp_subject = client.get("/api/courses", params={"subject_id": subject.id})
    assert resp_subject.status_code == 200
    assert len(resp_subject.json()) >= 2


# def test_course_update_and_delete_integration():
#     client = get_client()
#     db = next(get_db_session())

#     subject = db.query(Subject).first()
#     if not subject:
#         subject = Subject(id=1, name="Mathematics")
#         db.add(subject)
#         db.commit()
#         db.refresh(subject)

#     resp_create = client.post("/api/courses", json=_course_payload(subject.id, "Course Update"))
#     assert resp_create.status_code in (200, 201)
#     course_id = resp_create.json()["id"]

#     resp_update = client.put("/api/courses", json={"id": course_id, "title": "Course Updated", "max_students": 25})
#     assert resp_update.status_code == 200
#     updated = resp_update.json()
#     assert updated["title"] == "Course Updated"
#     assert updated["max_students"] == 25

#     db_course = db.query(Course).get(course_id)
#     assert db_course.title == "Course Updated"
#     assert db_course.max_students == 25

#     resp_delete = client.delete("/api/courses", json={"id": course_id})
#     assert resp_delete.status_code == 200

#     db_course_after = db.query(Course).get(course_id)
#     assert db_course_after is None


# # ==============================
# # === CourseSession CRUD tests =
# # ==============================

# def _create_course_for_sessions(db: Session, client: TestClient) -> int:
#     subject = db.query(Subject).first()
#     if not subject:
#         subject = Subject(id=1, name="Mathematics")
#         db.add(subject)
#         db.commit()
#         db.refresh(subject)

#     resp = client.post("/api/courses", json=_course_payload(subject.id, "Course For Session"))
#     assert resp.status_code in (200, 201)
#     return resp.json()["id"]


# def test_course_session_create_and_get_integration():
#     client = get_client()
#     db = next(get_db_session())
#     course_id = _create_course_for_sessions(db, client)

#     resp = client.post(f"/api/courses/{course_id}/sessions", json=_session_payload(course_id, 1))
#     assert resp.status_code in (200, 201)
#     session_id = resp.json()["id"]

#     db_sess = db.query(CourseSession).get(session_id)
#     assert db_sess is not None
#     assert db_sess.course_id == course_id
#     assert db_sess.session_number == 1


# def test_course_session_list_and_filters_integration():
#     client = get_client()
#     db = next(get_db_session())
#     course_id = _create_course_for_sessions(db, client)

#     client.post(f"/api/courses/{course_id}/sessions", json=_session_payload(course_id, 1))
#     client.post(f"/api/courses/{course_id}/sessions", json=_session_payload(course_id, 2))

#     resp_list = client.get(f"/api/courses/{course_id}/sessions")
#     assert resp_list.status_code == 200
#     numbers = {s["session_number"] for s in resp_list.json()}
#     assert numbers == {1, 2}


# def test_course_session_update_and_delete_integration():
#     client = get_client()
#     db = next(get_db_session())
#     course_id = _create_course_for_sessions(db, client)

#     resp_create = client.post(f"/api/courses/{course_id}/sessions", json=_session_payload(course_id, 1))
#     assert resp_create.status_code in (200, 201)
#     sid = resp_create.json()["id"]

#     resp_update = client.put(f"/api/courses/sessions/{sid}", json={"location": "New Room", "session_number": 3})
#     assert resp_update.status_code == 200
#     updated = resp_update.json()
#     assert updated["location"] == "New Room"
#     assert updated["session_number"] == 3

#     db_sess = db.query(CourseSession).get(sid)
#     assert db_sess.location == "New Room"
#     assert db_sess.session_number == 3

#     resp_delete = client.delete(f"/api/courses/sessions/{sid}")
#     assert resp_delete.status_code == 200
#     db_sess_after = db.query(CourseSession).get(sid)
#     assert db_sess_after is None
