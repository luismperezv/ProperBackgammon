from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.user import User, UserStats
from app.core.security import get_password_hash
from datetime import datetime
import traceback

def create_debug_user():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Debug user credentials
    username = "debug"
    email = "debug@example.com"
    password = "Debug123!"  # Updated to meet password requirements
    
    try:
        # Check if debug user already exists
        existing_user = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            print("Debug user already exists")
            return
        
        # Create debug user
        hashed_password = get_password_hash(password)
        debug_user = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            is_verified=True,  # Auto-verify debug user
            is_active=True,
            failed_login_attempts=0,
            account_locked_until=None
        )
        
        # Add and commit to get the user ID
        db.add(debug_user)
        db.commit()
        db.refresh(debug_user)
        
        # Create associated stats
        debug_stats = UserStats(
            user_id=debug_user.id,
            games_played=0,
            games_won=0,
            games_lost=0,
            elo_rating=1000.0,
            win_streak=0
        )
        db.add(debug_stats)
        db.commit()
        
        print("Debug user created successfully!")
        print(f"Username: {username}")
        print(f"Email: {email}")
        print(f"Password: {password}")
        
    except Exception as e:
        print(f"Error creating debug user:")
        print(traceback.format_exc())
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_debug_user() 