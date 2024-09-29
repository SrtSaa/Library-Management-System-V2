from flask import request, jsonify
from flask import current_app as app
from flask_security import auth_required, roles_required
import datetime as d
from application.model import *
from application.tasks import *





@app.route('/request-book', methods=["POST"])
@auth_required("token")
@roles_required("user")
def request_book():
    data = request.get_json()

    if data['type'] == 'get_data':
        user = User.query.filter_by(username=data.get('username', None)).first()
        if not user:
            return jsonify({'message': 'Invalid Username!'}), 404
        reqs = Book_Request.query.filter_by(user_id=user.id).all()
        book_ids = []
        for req in reqs:
            book_ids.append(req.ebook_id)
        return book_ids


    if data['type'] == 'put_data':
        user = User.query.filter_by(username=data.get('username', None)).first()
        if not user:
            return jsonify({'message': 'Invalid Username!'}), 404
        book = eBook.query.filter_by(id=data.get('book_id', None), active='True').first()
        if not book:
            return jsonify({'message': 'Invalid eBook ID!'}), 404
        if data.get('days', None) <= 0:
            return jsonify({'message': 'Invalid Requested Days!'}), 400
        issued = Book_Issued.query.filter_by(ebook_id=data.get('book_id', None), user_id=user.id).first()
        if issued:
            return jsonify({'message': 'Already Issued!'}), 400
        req = Book_Request.query.filter_by(ebook_id=data.get('book_id', None), user_id=user.id).first()
        if req:
            return jsonify({'message': 'Already requested!'}), 400
        
        new_req = Book_Request(
            ebook_id=data['book_id'], 
            user_id=user.id, 
            request_date=str(d.date.today()),
            required_day=data['days']
        )
        db.session.add(new_req)
        db.session.commit()
        return jsonify({'message': 'Request Registered!'})
    
    return jsonify({'message': 'Invalid Type!'}), 400





@app.route('/rate-book', methods=["POST"])
@auth_required("token")
@roles_required("user")
def rate_book():
    data = request.get_json()
    if data['type'] == 'get_rate':
        user = User.query.filter_by(username=data.get('username', None)).first()
        if not user:
            return jsonify({'message': 'Invalid Username!'}), 404
        book = eBook.query.filter_by(id=data.get('book_id', None)).first()
        if not book:
            return jsonify({'message': 'Invalid eBook ID!'}), 404

        rate = Rating.query.filter_by(ebook_id=data['book_id'], user_id=user.id).first()
        if not rate:
            return jsonify({'rate': None, 'feedback': None})
        return jsonify({'rate': rate.rating, 'feedback': rate.feedback})
    

    if data['type'] == 'put_rate':
        user = User.query.filter_by(username=data.get('username', None)).first()
        if not user:
            return jsonify({'message': 'Invalid Username!'}), 404
        book = eBook.query.filter_by(id=data.get('book_id', None)).first()
        if not book:
            return jsonify({'message': 'Invalid eBook ID!'}), 404
        if data.get('rate', None) < 1 or data.get('rate', None) > 5:
            return jsonify({'message': 'Invalid Rating!'}), 400
        
        rating = Rating.query.filter_by(ebook_id=data.get('book_id', None), user_id=user.id).first()
        if not rating:
            rating = Rating()
            rating.ebook_id = data['book_id']
            rating.user_id = user.id
        rating.rating = data['rate']
        rating.feedback = data['feedback']
        rating.date = str(d.date.today())
        db.session.add(rating)

        all_rating = Rating.query.filter_by(ebook_id=data.get('book_id', None)).all()
        total_rate = 0 
        for rate in all_rating:
            total_rate += rate.rating
        book.rating = round(total_rate/len(all_rating), 1)
        
        db.session.add(book)
        db.session.commit()
        return jsonify({'message': 'Rating and Feedback Updated!'})
    
    return jsonify({'message': 'Invalid Type!'}), 400





@app.route('/getIssuedBooksID/<string:uname>', methods=["GET"])
@auth_required("token")
@roles_required("user")
def getIssuedBooksID(uname):
    user = User.query.filter_by(username=uname).first()
    if not user:
        return jsonify({'message': 'Invalid Username!'}), 404

    issued = Book_Issued.query.filter_by(user_id=user.id).all()

    issued_book_list = []
    for issue in issued:
        issued_book_list.append(issue.ebook_id)
    return issued_book_list





@app.route('/getPurchasedBooksID/<string:uname>', methods=["GET"])
@auth_required("token")
@roles_required("user")
def getPurchasedBooksID(uname):
    user = User.query.filter_by(username=uname).first()
    if not user:
        return jsonify({'message': 'Invalid Username!'}), 404

    purchased = Purchase.query.filter_by(user_id=user.id).all()

    purchase_book_list = []
    for purchase in purchased:
        purchase_book_list.append(purchase.ebook_id)
    return purchase_book_list
    




@app.route('/purchaseBook', methods=["POST"])
@auth_required("token")
@roles_required("user")
def purchaseBook():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username', None)).first()
    if not user:
        return jsonify({'message': 'Invalid Username!'}), 404
    book = eBook.query.filter_by(id=data.get('book_id', None), active='True').first()
    if not book:
        return jsonify({'message': 'Invalid eBook ID!'}), 404
    
    purchased = Purchase.query.filter_by(ebook_id=data['book_id'], user_id=user.id).first()
    if purchased:
        return jsonify({'message': 'eBook is Already Purchased!'}), 400
    
    requested = Book_Request.query.filter_by(ebook_id=data['book_id'], user_id=user.id).first()
    if requested:
        db.session.delete(requested)

    issued = Book_Issued.query.filter_by(ebook_id=data['book_id'], user_id=user.id).first()
    if issued:
        returned = Return_List(
            ebook_id = issued.ebook_id,
            user_id = issued.user_id,
            issue_date = issued.issue_date,
            return_date = str(d.date.today())
        )
        db.session.add(returned)
        db.session.delete(issued)
        
    purchased = Purchase(
        ebook_id = data['book_id'],
        user_id = user.id,
        date = str(d.date.today())
    )

    db.session.add(purchased)
    db.session.commit()
    return jsonify({'message': 'eBook Purchased Successfully!'})





@app.route('/returnBook', methods=["POST"])
@auth_required("token")
@roles_required("user")
def returnBook():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username', None)).first()
    if not user:
        return jsonify({'message': 'Invalid Username!'}), 404
    book = eBook.query.filter_by(id=data.get('book_id', None), active='True').first()
    if not book:
        return jsonify({'message': 'Invalid eBook ID!'}), 404

    issued = Book_Issued.query.filter_by(ebook_id=data['book_id'], user_id=user.id).first()
    if not issued:
        return jsonify({'message': 'eBook is not Issued!'}), 400
    
    db.session.delete(issued)

    returned = Return_List(
        ebook_id = issued.ebook_id,
        user_id = issued.user_id,
        issue_date = issued.issue_date,
        return_date = str(d.date.today())
    )
    db.session.add(returned)
    db.session.commit()
    return jsonify({'message': 'eBook Returned Successfully!'})




