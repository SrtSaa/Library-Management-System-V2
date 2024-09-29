from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin, SQLAlchemyUserDatastore
from flask_caching import Cache

cache = Cache()
db = SQLAlchemy()



class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=True)
    password = db.Column(db.String(255))
    phone = db.Column(db.String, unique=True, nullable=True)
    dob = db.Column(db.String, nullable=True)
    gender = db.Column(db.String(1), nullable=True)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))
    book_requests = db.relationship('Book_Request', backref='user_req', lazy=True)
    book_issued = db.relationship('Book_Issued', backref='user_issue', lazy=True)
    book_returned = db.relationship('Return_List', backref='user_return', lazy=True)
    book_revoked = db.relationship('Revoke_List', backref='user_revoke', lazy=True)
    book_purchased = db.relationship('Purchase', backref='user_purchase', lazy=True)
   

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))




class Section(db.Model):
    __tablename__ = 'section'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    date_created = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    active = db.Column(db.String, nullable=False, default="True")
    ebooks = db.relationship('eBook', backref='section')


class eBook(db.Model):
    __tablename__ = 'ebook'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey("section.id"), nullable=False)
    authors_name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    date_created = db.Column(db.String, nullable=False)
    active = db.Column(db.String, nullable=False, default="True")
    rating = db.Column(db.Float, nullable=False, default=0)
    book_requests = db.relationship('Book_Request', backref='ebook_req', lazy=True)
    book_issued = db.relationship('Book_Issued', backref='ebook_issue', lazy=True)
    book_returned = db.relationship('Return_List', backref='ebook_return', lazy=True)
    book_revoked = db.relationship('Revoke_List', backref='ebook_revoke', lazy=True)
    book_purchased = db.relationship('Purchase', backref='ebook_purchase', lazy=True)




class Book_Issued(db.Model):
    __tablename__ = 'book_issued'
    id = db.Column(db.Integer, primary_key=True)
    ebook_id = db.Column(db.Integer, db.ForeignKey("ebook.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("user.id"), nullable=False)
    issue_date = db.Column(db.String, nullable=False)
    return_date = db.Column(db.String, nullable=False)


class Book_Request(db.Model):
    __tablename__ = 'book_request'
    id = db.Column(db.Integer, primary_key=True)
    ebook_id = db.Column(db.Integer, db.ForeignKey("ebook.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("user.id"), nullable=False)
    request_date = db.Column(db.String, nullable=False)
    required_day = db.Column(db.Integer, nullable=False)


class Return_List(db.Model):
    __tablename__ = 'return_list'
    id = db.Column(db.Integer, primary_key=True)
    ebook_id = db.Column(db.Integer, db.ForeignKey("ebook.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("user.id"), nullable=False)
    issue_date = db.Column(db.String, nullable=False)
    return_date = db.Column(db.String, nullable=False)


class Revoke_List(db.Model):
    __tablename__ = 'revoke_list'
    id = db.Column(db.Integer, primary_key=True)
    ebook_id = db.Column(db.Integer, db.ForeignKey("ebook.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("user.id"), nullable=False)
    revoke_date = db.Column(db.String, nullable=False)




class Delete_ebook(db.Model):
    __tablename__ = 'delete_ebook'
    id = db.Column(db.Integer, primary_key=True)
    ebook_id = db.Column(db.Integer, db.ForeignKey("ebook.id"), nullable=False)
    date = db.Column(db.String, nullable=False)


class Delete_section(db.Model):
    __tablename__ = 'delete_section'
    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey("section.id"), nullable=False)
    date = db.Column(db.String, nullable=False)



class Rating(db.Model):
    __tablename__ = 'rating'
    id = db.Column(db.Integer, primary_key=True)
    ebook_id = db.Column(db.Integer, db.ForeignKey("ebook.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("user.id"), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.String)
    date = db.Column(db.String, nullable=False)


class Purchase(db.Model):
    __tablename__ = 'purchase'
    id = db.Column(db.Integer, primary_key=True)
    ebook_id = db.Column(db.Integer, db.ForeignKey("ebook.id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("user.id"), nullable=False)
    date = db.Column(db.String, nullable=False)




datastore = SQLAlchemyUserDatastore(db, User, Role)
