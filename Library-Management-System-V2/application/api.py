from flask import jsonify
from flask_restful import Resource, fields, marshal_with, reqparse, Api
from flask_security import auth_required, roles_required
from werkzeug.security import check_password_hash, generate_password_hash
import datetime as d
from application.model import *


api = Api(prefix='/api')





class section(fields.Raw):
    def format(self, sec):
        return sec.title
    


# ----------- Output Feilds -----------
section_details = {
    "id": fields.Integer,
    "title": fields.String,
    "date_created": fields.String,
    "description": fields.String,
    "active": fields.String,
}



ebook_details = {
    "id": fields.Integer,
    "title": fields.String,
    "section_id": fields.Integer,
    "authors_name": fields.String,
    "description": fields.String,
    "date_created": fields.String, 
    "active": fields.String, 
    "rating": fields.Float,
    "section": section
}



user_details = {
    "id": fields.Integer,
    "first_name": fields.String,
    "last_name": fields.String,
    "username": fields.String,
    "email": fields.String,
    "phone": fields.String,
    "dob": fields.String,
    "gender": fields.String
}







# ----------- Parsers -----------
add_section_parser = reqparse.RequestParser()
add_section_parser.add_argument('title', type=str, help='title is required and should be a string', required=True)
add_section_parser.add_argument('description', type=str, help='description should be a string')

add_ebook_parser = reqparse.RequestParser()
add_ebook_parser.add_argument('title', type=str, help='title is required and should be a string', required=True)
add_ebook_parser.add_argument('SectionID', type=int, help='section_name is required and should be an integer', required=True)
add_ebook_parser.add_argument('authors', type=str, help='authors_name is required and should be a string', required=True)
add_ebook_parser.add_argument('description', type=str, help='description should be a string')

accrej_request_parser = reqparse.RequestParser()
accrej_request_parser.add_argument('action', type=str, help='action is required and should be a string', required=True)
accrej_request_parser.add_argument('eb_id', type=int, help='eb_id is required and should be a int', required=True)
accrej_request_parser.add_argument('u_id', type=int, help='u_id is required and should be a int', required=True)
accrej_request_parser.add_argument('day', type=int, help='day is required and should be a int')

user_details_parser = reqparse.RequestParser()
user_details_parser.add_argument('username', type=str, help='required and should be a string', required=True)
user_details_parser.add_argument('email', type=str, help='required and should be a string', required=True)
user_details_parser.add_argument('phone', type=str, help='required and should be a string', required=True)

pw_parser = reqparse.RequestParser()
pw_parser.add_argument('username', type=str, help='required and should be a string')
pw_parser.add_argument('oldpw', type=str, help='required and should be a string')
pw_parser.add_argument('newpw', type=str, help='required and should be a string')
pw_parser.add_argument('cnfpw', type=str, help='required and should be a string')







# ----------- APIs -----------
class SectionAPI(Resource):

    @auth_required('token')
    @marshal_with(section_details)
    def get(self):
        sections = Section.query.filter_by(active='True').all()
        if len(sections)>0:
            return sections
        return {"message": "No Section presents!"}, 404
    

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = add_section_parser.parse_args()

        section = Section.query.filter_by(title=args['title'].title(), active='True').first()
        if section is not None:
            return {"message": "Title already exists!"}, 400

        new_section = Section()
        new_section.title = args["title"].title()
        new_section.description = args.get("description", None)
        new_section.date_created = str(d.date.today())
        db.session.add(new_section)
        db.session.commit()
        return {"message": "New section added successfully!"}


    @auth_required('token')
    @roles_required('admin')
    def delete(self, s_id):
        section = Section.query.filter_by(id=s_id).first()

        if section is None:
            return {"message": "Invalid Section ID!"}, 404

        ebooks = eBook.query.filter_by(section_id=s_id)
        for ebook in ebooks:
            requests = Book_Request.query.filter_by(ebook_id=ebook.id).all()
            if requests:
                for request in requests:
                    revoked = Revoke_List(
                        ebook_id = request.ebook_id,
                        user_id = request.user_id,
                        revoke_date = str(d.date.today())
                    )
                    db.session.add(revoked)
                    db.session.delete(request)

            issues = Book_Issued.query.filter_by(ebook_id=ebook.id).all()
            if issues:
                for issue in issues:
                    returned = Return_List(
                        ebook_id = issue.ebook_id,
                        user_id = issue.user_id,
                        issue_date = issue.issue_date,
                        return_date = str(d.date.today())
                    )
                    db.session.delete(issue)
                    db.session.add(returned)

            delete_ebook = Delete_ebook(
                ebook_id = ebook.id,
                date = str(d.date.today())
            )

            ebook.active = 'False'
            db.session.add(ebook)
            db.session.add(delete_ebook)

        section.active = 'False'
        delete_section = Delete_section(
                section_id = section.id,
                date = str(d.date.today())
            )
        
        db.session.add(section)
        db.session.add(delete_section)
        db.session.commit()
        return {"message": "Section Deleted Successfully!"}
    



class eBookAPI(Resource):
    
    @auth_required('token')
    @cache.cached(timeout=30)
    @marshal_with(ebook_details)
    def get(self, eb_id=None):
        if eb_id:
            ebooks = eBook.query.filter_by(id=eb_id, active='True').first()
        else:
            ebooks = eBook.query.filter_by(active='True').all()
        if ebooks:
            return ebooks
        return {"message": "No eBook presents!"}, 404
    

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = add_ebook_parser.parse_args()

        section = Section.query.filter_by(id=args['SectionID'], active='True').first()
        if section is None:
            return {"message": "Invalid Section ID!"}, 400
        book = eBook.query.filter_by(title=args['title'].strip().title(), active='True').first()
        if book is not None:
            return {"message": "Book exists!"}, 400
        
        new_ebook = eBook()
        new_ebook.title = args["title"].strip().title()
        new_ebook.section_id = args["SectionID"]
        new_ebook.authors_name = args["authors"]
        new_ebook.description = args.get("description", None)
        new_ebook.date_created = str(d.date.today())
        db.session.add(new_ebook)
        db.session.commit()
        return {"message": "New eBook added successfully!"}

    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, eb_id):
        ebook = eBook.query.filter_by(id=eb_id).first()

        if ebook is None:
            return {"message": "Invalid eBook ID"}, 404
        
        requested = Book_Request.query.filter_by(ebook_id=eb_id).all()
        if requested:
            for request in requested:
                revoked = Revoke_List(
                    ebook_id = request.ebook_id,
                    user_id = request.user_id,
                    revoke_date = str(d.date.today())
                )
                db.session.add(revoked)
                db.session.delete(request)

        issueed = Book_Issued.query.filter_by(ebook_id=eb_id).all()
        if issueed:
            for issue in issueed:
                returned = Return_List(
                    ebook_id = issue.ebook_id,
                    user_id = issue.user_id,
                    issue_date = issue.issue_date,
                    return_date = str(d.date.today())
                )
                db.session.delete(issue)
                db.session.add(returned)

        ebook.active = 'False'
        delete_ebook = Delete_ebook(
            ebook_id = ebook.id,
            date = str(d.date.today())
        )
        db.session.add(delete_ebook)
        db.session.add(ebook)
        db.session.commit()
        return {"message": "eBook Deleted successfully!"}   




class requestApI(Resource):

    @auth_required('token')
    @roles_required('admin')
    def get(self):
        book_requests = Book_Request.query.all()
        if book_requests:
            result = []
            for request in book_requests:
                result.append({
                    'ebook_id': request.ebook_id,
                    'user_id': request.user_id,
                    'username': request.user_req.username,
                    'request_date': request.request_date,
                    'required_day': request.required_day
                })
            return jsonify(result)
        return {"message": "No Pending Request!"}, 404


    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args = accrej_request_parser.parse_args()
        
        ebook = eBook.query.filter_by(id=args['eb_id'], active='True').first()
        if not ebook:
            return {"message": "Invalid eBook ID!"}, 404

        user = User.query.filter_by(id=args['u_id']).first()
        if not user:
            return {"message": "Invalid User ID!"}, 404
        
        if args['action']=='accept':

            if not args.get('day', None) or args['day']<=0:
                return {"message": "Invalid Days Requested!"}, 400

            issued = Book_Issued.query.filter_by(ebook_id=args['eb_id'], user_id=args['u_id']).first()
            if issued:
                return {"message": "Book is Already Issued!"}, 400
            
            issued = Book_Issued(
                ebook_id = args['eb_id'],
                user_id = args['u_id'],
                issue_date = str(d.date.today()),
                return_date = str(d.date.today() + d.timedelta(days=args['day']+1))
            )
            
            request = Book_Request.query.filter_by(ebook_id=args['eb_id'], user_id=args['u_id']).first()
            
            db.session.add(issued)
            db.session.delete(request)
            db.session.commit()
            return {"message": "eBook Issued Successfully!"}
        
        elif args['action']=='reject':
            revoke = Revoke_List(
                ebook_id = args['eb_id'],
                user_id = args['u_id'],
                revoke_date = str(d.date.today())
            )

            request = Book_Request.query.filter_by(ebook_id=args['eb_id'], user_id=args['u_id']).first()
             
            db.session.add(revoke)
            db.session.delete(request)
            db.session.commit()
            return {"message": "Request Revoked Successfully!"}


        return {"message": "Invalid Action!"}, 400
        

        

class UsersDetailsAPI(Resource):
    
    @auth_required('token')
    @roles_required('admin')
    @marshal_with(user_details)
    def get(self, u_id=None):
        if u_id:
            users = User.query.filter_by(id=u_id).first()
        else:
            users = User.query.filter(User.username!="root").all()
        if users:
            return users
        return {"message": "No User exists!"}, 404




class UsersDetailsAPI2(Resource):
    
    @auth_required('token')
    @roles_required('user')
    @marshal_with(user_details)
    def get(self, uname):
        user = User.query.filter_by(username=uname).first() 
        if user:
            return user
        return {"message": "No User exists!"}, 404




class UserDetailsUpdate(Resource):

    @auth_required('token')
    @roles_required('user')
    def post(self):
        args = user_details_parser.parse_args()

        user = User.query.filter_by(username=args['username']).first()
        if not user:
            return {'message': "Invalid Username!"}, 404
        
        tuser = User.query.filter(User.username!=args['username']).filter_by(email=args['email']).first()
        if tuser:
            return {'message': "Email Exists!"}, 400
        
        tuser = User.query.filter(User.username!=args['username']).filter_by(phone=args['phone']).first()
        if tuser:
            return {'message': "Phone Number Exists!"}, 400
        
        user.email = args['email']
        user.phone = args['phone']
        db.session.add(user)
        db.session.commit()
        return {'message': 'Details Updated Successfully!'}




class UserPasswordUpdate(Resource):

    @auth_required('token')
    @roles_required('user')
    def post(self):
        args = pw_parser.parse_args()

        user = User.query.filter_by(username=args['username']).first()
        if not user:
            return {'message': "Invalid Username!"}, 404
        
        if check_password_hash(user.password, args['oldpw']):
            if args['newpw'] != args['cnfpw']:
                return {"message": "New Password and Confirm password should be same!"}, 400
            
            user.password = generate_password_hash(args['newpw'])
            db.session.add(user)
            db.session.commit()
            return {'message': 'Password Updated Successfully!'}

        return {"message": "Invalid Old Password!"}, 400
        



class allIssuedBooksAPI(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        book_issued = Book_Issued.query.all()
        if book_issued:
            result = []
            for book in book_issued:
                result.append({
                    'ebook_id': book.ebook_id,
                    'title': book.ebook_issue.title,
                    'user_id': book.user_id,
                    'username': book.user_issue.username,
                    'issued_date': book.issue_date,
                    'return_date': book.return_date
                })
            result.reverse()
            return jsonify(result)
        return {"message": "No Book Issued!"}, 404




class allReturnedBooksAPI(Resource):
    @auth_required('token')
    def get(self):
        book_returned = Return_List.query.all()
        if book_returned:
            result = []
            for book in book_returned:
                result.append({
                    'ebook_id': book.ebook_id,
                    'title': book.ebook_return.title,
                    'user_id': book.user_id,
                    'username': book.user_return.username,
                    'issue_date': book.issue_date,
                    'return_date': book.return_date
                })
            result.reverse()
            return jsonify(result)
        return {"message": "No Book Returned!"}, 404




class allRevokedBooksAPI(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        book_revoked = Revoke_List.query.all()
        if book_revoked:
            result = []
            for book in book_revoked:
                result.append({
                    'ebook_id': book.ebook_id,
                    'title': book.ebook_revoke.title,
                    'user_id': book.user_id,
                    'username': book.user_revoke.username,
                    'revoke_date': book.revoke_date
                })
            result.reverse()
            return jsonify(result)
        return {"message": "No Book Revoked!"}, 404




class allPurchasedBooksAPI(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        book_purchased = Purchase.query.all()
        if book_purchased:
            result = []
            for book in book_purchased:
                result.append({
                    'ebook_id': book.ebook_id,
                    'title': book.ebook_purchase.title,
                    'user_id': book.user_id,
                    'username': book.user_purchase.username,
                    'purchase_date': book.date
                })
            result.reverse()
            return jsonify(result)
        return {"message": "No Book Purchased!"}, 404



class chartAPI(Resource):
    def get(self, uname=None):
        if not uname:
            book_request = Book_Request.query.filter().all()
            book_issue = Book_Issued.query.filter().all()
            book_revoke = Revoke_List.query.filter().all()
            book_return = Return_List.query.filter().all()
            book_purchase = Purchase.query.filter().all()
        else:
            user = User.query.filter_by(username=uname).first()
            book_request = Book_Request.query.filter_by(user_id=user.id).filter().all()
            book_issue = Book_Issued.query.filter_by(user_id=user.id).filter().all()
            book_revoke = Revoke_List.query.filter_by(user_id=user.id).filter().all()
            book_return = Return_List.query.filter_by(user_id=user.id).filter().all()
            book_purchase = Purchase.query.filter_by(user_id=user.id).filter().all()

        
        section = {}
        for book in book_request:
            section[book.ebook_req.section.title] =  section.get(book.ebook_req.section.title, 0) + 1
        for book in book_issue:
            section[book.ebook_issue.section.title] = section.get(book.ebook_issue.section.title, 0) + 1
        for book in book_revoke:
            section[book.ebook_revoke.section.title] = section.get(book.ebook_revoke.section.title, 0) + 1
        for book in book_return:
            section[book.ebook_return.section.title] = section.get(book.ebook_return.section.title, 0) + 1

        ebook = {}
        for book in book_request:
            ebook[book.ebook_req.title] = ebook.get(book.ebook_req.title, 0) + 1
        for book in book_issue:
            ebook[book.ebook_issue.title] = ebook.get(book.ebook_issue.title, 0) + 1
        for book in book_revoke:
            ebook[book.ebook_revoke.title] = ebook.get(book.ebook_revoke.title, 0) + 1
        for book in book_return:
            ebook[book.ebook_return.title] = ebook.get(book.ebook_return.title, 0) + 1
        ebook = ebook.items()
        ebook = sorted(ebook, key=lambda book: book[0], reverse=True)
        if len(ebook)>5:
            ebook = ebook[:5]
        ebook = dict(ebook)

        purchase = {}
        for book in book_purchase:
            purchase[book.ebook_purchase.title] = purchase.get(book.ebook_purchase.title, 0) + 1
        purchase = purchase.items()
        purchase = sorted(purchase, key=lambda book: book[0], reverse=True)
        if len(purchase)>5:
            purchase = purchase[:5]
        purchase = dict(purchase)

        return jsonify([section, ebook, purchase])








api.add_resource(SectionAPI, '/Section', '/Section/<int:s_id>')
api.add_resource(eBookAPI, '/eBook', '/eBook/<int:eb_id>')
api.add_resource(requestApI, '/bookRequests')
api.add_resource(UsersDetailsAPI, '/usersDetails', '/usersDetails/<int:u_id>')
api.add_resource(UsersDetailsAPI2, '/usersDetails/<uname>')
api.add_resource(UserDetailsUpdate, '/userDetailsUpdate')
api.add_resource(UserPasswordUpdate, '/userPasswordUpdate')
api.add_resource(allIssuedBooksAPI, '/allIssuedBooks')
api.add_resource(allReturnedBooksAPI, '/allReturnedBooks')
api.add_resource(allRevokedBooksAPI, '/allRevokedBooks')
api.add_resource(allPurchasedBooksAPI, '/allPurchasedBooks')

api.add_resource(chartAPI, '/chartAPI', '/chartAPI/<uname>')


