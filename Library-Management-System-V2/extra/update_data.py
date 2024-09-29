from app import app
from application.model import *
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an librarian")
    datastore.find_or_create_role(name="user", description="User is an normal user")

    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(
            first_name="admin",
            username="root", 
            email="admin@email.com", 
            password=generate_password_hash("Admin@123"), 
            phone="1234567890",
            dob="2020-01-01",
            gender="O",
            roles=['admin']
        )
    if not datastore.find_user(email="srtsaa@email.com"):
        datastore.create_user(
            username="srt_saa", 
            first_name="Srt",
            last_name="Saa",
            email="srtsaa@email.com", 
            password=generate_password_hash("Srt@123"), 
            phone="1234567891",
            dob="2020-01-02",
            gender="M",
            roles=['user']
        )
    

    db.session.commit()