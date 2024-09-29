from flask import render_template, redirect, jsonify, request
from flask import current_app as app
from werkzeug.security import check_password_hash, generate_password_hash
from application.model import *





@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")



@app.route("/LogIn", methods=["POST"])
def user_login():
    data = request.get_json()
    user = datastore.find_user(email=data['emailoruname'])
    if not user:
        user = datastore.find_user(username=data['emailoruname'])
        if not user:
            return jsonify({"message": "User Not Found"}), 400
    
    if check_password_hash(user.password, data['password']):
        return jsonify({"token": user.get_auth_token(), "username": user.username, "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400



@app.route("/user-register", methods=["POST"])
def user_register():
    data = request.get_json()
    user = datastore.find_user(username=data['uname'])
    if user:
        return jsonify({"message": "Username already exists! Please try another..."}), 400
    user = datastore.find_user(email=data['email'])
    if user:
        return jsonify({"message": "Email already exists!"}), 400
    user = datastore.find_user(phone=data['phone'])
    if user:
        return jsonify({"message": "Phone number already exists!"}), 400
    
    datastore.create_user(
        username=data['uname'], 
        first_name=data['fname'],
        last_name=data['lname'],
        email=data['email'], 
        password=generate_password_hash(data['password']), 
        phone=data['phone'],
        dob=data['dob'],
        gender=data['gender'],
        roles=['user']
    )
    
    db.session.commit()
    return jsonify({"message": "New user registered successfully!"})

    




