import logging
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from flask_cors import CORS
from sqlalchemy.orm import backref

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)
app.config['JWT_SECRET_KEY'] = os.urandom(24)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

print("Before Classes")
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    date = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=backref('transactions', lazy=True))

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=str(user.id))
        print("User logged in succesfully")
        return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    print("Getting transactions:")
    current_user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        'id': t.id,
        'amount': t.amount,
        'description': t.description,
        'category': t.category,
        'date': t.date
    } for t in transactions]), 200

@app.route('/transactions', methods=['POST'])
@jwt_required()
def add_transaction():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        logger.debug("current user id from jwt: %s", current_user_id)
        logger.debug("current data: %s", data)
        new_transaction = Transaction(
            amount=data['amount'],
            description=data['description'],
            category=data['category'],
            date=data['date'],
            user_id=current_user_id
        )
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify({'message': 'Transaction added successfully'}), 201
    except Exception as e:
        logger.error("Error: %s", str(e))
        return jsonify({'error': str(e)}), 422

@app.route('/transactions/<int:id>', methods=['PUT'])
@jwt_required()
def update_transaction(id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=id, user_id=current_user_id).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404

    data = request.get_json()
    transaction.amount = data.get('amount', transaction.amount)
    transaction.description = data.get('description', transaction.description)
    transaction.category = data.get('category', transaction.category)
    transaction.date = data.get('date', transaction.date)

    db.session.commit()
    return jsonify({'message': 'Transaction updated successfully'}), 200

@app.route('/transactions/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=id, user_id=current_user_id).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted successfully'}), 200

if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.run(debug=True)