import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services.notification_service import NotificationService
from app.models.notification import Notification, NotificationType


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:")
    metadata = Notification.__table__.metadata
    metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    metadata.drop_all(engine)


@pytest.fixture()
def notification_service(db_session):
    return NotificationService(db_session)


def test_notification_service_create_and_get(notification_service):
    notif = notification_service.create(
        user_id="user_a",
        type=list(NotificationType)[0],
        title="Welcome",
        content="Hello user",
        related_id=1,
        is_read=False,
    )
    fetched = notification_service.get_by_id(notif.id)
    assert fetched is not None
    assert fetched.title == "Welcome"
    assert fetched.user_id == "user_a"


def test_notification_service_query_methods(notification_service):
    types = list(NotificationType)
    type_a = types[0]
    type_b = types[1] if len(types) > 1 else types[0]

    n1 = notification_service.create("user_a", type_a, "A1", "Body1", related_id=1)
    n2 = notification_service.create("user_a", type_b, "A2", "Body2", related_id=2, is_read=True)
    n3 = notification_service.create("user_b", type_b, "B1", "Body3")

    all_items = notification_service.get_all()
    assert {n.id for n in all_items} == {n1.id, n2.id, n3.id}

    by_user = notification_service.get_by_user("user_a")
    assert {n.id for n in by_user} == {n1.id, n2.id}

    unread_user_a = notification_service.get_unread_by_user("user_a")
    assert {n.id for n in unread_user_a} == {n1.id}

    by_type = notification_service.get_by_type(type_b)
    assert {n.id for n in by_type} == {n2.id, n3.id}


def test_notification_service_mark_operations(notification_service):
    n1 = notification_service.create("user_c", list(NotificationType)[0], "C1", "Body")
    notification_service.create("user_c", list(NotificationType)[0], "C2", "Body2")
    marked = notification_service.mark_as_read(n1.id)
    assert marked.is_read is True
    assert notification_service.mark_as_read(9999) is None

    updated_count = notification_service.mark_all_as_read("user_c")
    assert updated_count == 1  # second notification flipped
    unread_after = notification_service.get_unread_by_user("user_c")
    assert len(unread_after) == 0


def test_notification_service_update_and_delete(notification_service):
    notif = notification_service.create("user_d", list(NotificationType)[0], "Old", "Old body")

    updated = notification_service.update(
        notification_id=notif.id,
        title="New title",
        content="New body",
        is_read=True,
    )
    assert updated.title == "New title"
    assert updated.content == "New body"
    assert updated.is_read is True

    assert notification_service.update(9999, title="Ghost") is None

    assert notification_service.delete(notif.id) is True
    assert notification_service.get_by_id(notif.id) is None
    assert notification_service.delete(notif.id) is False