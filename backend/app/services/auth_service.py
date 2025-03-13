from datetime import datetime, timedelta
import uuid
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from pydantic import EmailStr

from app.core.security import verify_password, get_password_hash, create_access_token, verify_token
from app.models.user import User, PasswordResetToken
from app.schemas.auth import UserCreate, UserLogin
from app.core.config import settings
from app.services.email_service import EmailService

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.email_service = EmailService()

    async def register_user(self, user_data: UserCreate) -> User:
        """Register a new user."""
        # Check if user already exists
        if self.db.query(User).filter(User.email == user_data.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        if self.db.query(User).filter(User.username == user_data.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            id=user_id,
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)

        # Send verification email
        verification_token = create_access_token(
            {"sub": user_id, "type": "verification"},
            expires_delta=timedelta(hours=24)
        )
        await self.email_service.send_verification_email(user_data.email, verification_token)

        return db_user

    async def verify_email(self, token: str) -> bool:
        """Verify user's email address."""
        payload = verify_token(token)
        if not payload or payload.get("type") != "verification":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token"
            )

        user = self.db.query(User).filter(User.id == payload["sub"]).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        user.is_verified = True
        self.db.commit()
        return True

    async def authenticate_user(self, form_data: UserLogin) -> User:
        """Authenticate user and handle login attempts."""
        user = self.db.query(User).filter(
            (User.email == form_data.username) | (User.username == form_data.username)
        ).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )

        # Check if account is locked
        if user.account_locked_until and user.account_locked_until > datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Account locked until {user.account_locked_until}"
            )

        # Verify password
        if not verify_password(form_data.password, user.hashed_password):
            # Handle failed login attempt
            user.failed_login_attempts += 1
            user.last_failed_login = datetime.utcnow()

            # Lock account if too many failed attempts
            if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                lock_duration = timedelta(minutes=settings.ACCOUNT_LOCKOUT_MINUTES)
                user.account_locked_until = datetime.utcnow() + lock_duration
                await self.email_service.send_account_locked_email(
                    user.email,
                    user.account_locked_until.strftime("%Y-%m-%d %H:%M:%S UTC")
                )

            self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )

        # Reset failed login attempts on successful login
        user.failed_login_attempts = 0
        user.last_login = datetime.utcnow()
        self.db.commit()

        return user

    async def initiate_password_reset(self, email: EmailStr) -> bool:
        """Initiate password reset process."""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            # Return True even if user doesn't exist to prevent email enumeration
            return True

        # Create password reset token
        token = str(uuid.uuid4())
        reset_token = PasswordResetToken(
            id=str(uuid.uuid4()),
            user_id=user.id,
            token=token,
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        self.db.add(reset_token)
        self.db.commit()

        # Send password reset email
        await self.email_service.send_password_reset_email(email, token)
        return True

    async def reset_password(self, token: str, new_password: str) -> bool:
        """Reset user's password using reset token."""
        reset_token = self.db.query(PasswordResetToken).filter(
            PasswordResetToken.token == token,
            PasswordResetToken.is_used == False,
            PasswordResetToken.expires_at > datetime.utcnow()
        ).first()

        if not reset_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )

        user = self.db.query(User).filter(User.id == reset_token.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update password and mark token as used
        user.hashed_password = get_password_hash(new_password)
        reset_token.is_used = True
        self.db.commit()

        return True

    def create_user_token(self, user: User) -> dict:
        """Create access token for user."""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    def refresh_access_token(self, refresh_token: str) -> dict:
        """Create new access token using refresh token."""
        payload = verify_token(refresh_token)
        if not payload or not payload.get("refresh"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        user_id = payload.get("sub")
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )

        return self.create_user_token(user) 