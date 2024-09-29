from flask import request, jsonify
from flask import current_app as app
from flask_security import auth_required, roles_required
import datetime as d
from application.model import *
from application.tasks import *





@app.route('/getFeedback', methods=["POST"])
@auth_required("token")
def getFeedback():
    data = request.get_json()

    book = eBook.query.filter_by(id=data.get('book_id', None)).first()
    if not book:
        return jsonify({'message': 'Invalid eBook ID!'}), 404
    
    ratings = Rating.query.filter_by(ebook_id=data.get('book_id', None)).all()
    
    feedbacks = []
    for rating in ratings:
        if len(rating.feedback.strip()) > 0:
            feedbacks.append(rating.feedback)
    return feedbacks





@app.route('/getIssuedBooks/<string:uname>', methods=["GET"])
@auth_required("token")
def getIssuedBooks(uname):
    user = User.query.filter_by(username=uname).first()
    if not user:
        return jsonify({'message': 'Invalid Username!'}), 404

    issued_books = Book_Issued.query.filter_by(user_id=user.id).all()
    results = []
    for book in issued_books:
        results.append({
            'id': book.ebook_id,
            'title': book.ebook_issue.title,
            'section': book.ebook_issue.section.title,
            'authors': book.ebook_issue.authors_name
        })
    return jsonify(results)





@app.route('/getPurchasedBooks/<string:uname>', methods=["GET"])
@auth_required("token")
def getPurchasedBooks(uname):
    user = User.query.filter_by(username=uname).first()
    if not user:
        return jsonify({'message': 'Invalid Username!'}), 404

    purchased_books = Purchase.query.filter_by(user_id=user.id).all()
    results = []
    for book in purchased_books:
        results.append({
            'id': book.ebook_id,
            'title': book.ebook_purchase.title,
            'section': book.ebook_purchase.section.title,
            'authors': book.ebook_purchase.authors_name
        })
    return jsonify(results)




