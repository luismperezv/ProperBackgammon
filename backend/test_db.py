from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User, UserStats
from datetime import datetime

db = SessionLocal()

# Create a test user
test_user = User(
    username='testuser',
    email='test@example.com',
    password_hash='dummy_hash'
)

# Add and commit to get the user ID
db.add(test_user)
db.commit()
db.refresh(test_user)

# Create associated stats
test_stats = UserStats(user_id=test_user.id)
db.add(test_stats)
db.commit()

# Verify the data
user = db.query(User).first()
stats = db.query(UserStats).first()
print(f'User created_at: {user.created_at}')
print(f'Stats join_date: {stats.join_date}')
print(f'User ID: {user.id}, Stats user_id: {stats.user_id}')
print(f'Relationship test: {user.stats.elo_rating}')

try:
    # Try to create a user with the same username
    duplicate_user = User(
        username='testuser',  # Same username as before
        email='different@example.com',
        password_hash='dummy_hash'
    )
    db.add(duplicate_user)
    db.commit()
    print("Error: Uniqueness constraint failed!")
except Exception as e:
    print(f"Successfully caught duplicate username: {str(e)}")

try:
    # Try to create a user with the same email
    duplicate_email_user = User(
        username='different_user',
        email='test@example.com',  # Same email as before
        password_hash='dummy_hash'
    )
    db.add(duplicate_email_user)
    db.commit()
    print("Error: Email uniqueness constraint failed!")
except Exception as e:
    print(f"Successfully caught duplicate email: {str(e)}")

db.close() 