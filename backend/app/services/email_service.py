from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from app.core.config import settings
from jinja2 import Environment, select_autoescape, PackageLoader

# Email templates environment
env = Environment(
    loader=PackageLoader('app', 'templates/email'),
    autoescape=select_autoescape(['html', 'xml'])
)

class EmailService:
    def __init__(self):
        if not settings.EMAIL_ENABLED:
            # For test environments, use a minimal configuration
            self.config = ConnectionConfig(
                MAIL_USERNAME="test@example.com",
                MAIL_PASSWORD="test_password",
                MAIL_FROM="test@example.com",
                MAIL_PORT=587,
                MAIL_SERVER="smtp.example.com",
                MAIL_SSL_TLS=False,
                MAIL_STARTTLS=True,
                USE_CREDENTIALS=True,
                SUPPRESS_SEND=True  # Suppress actual email sending in tests
            )
        else:
            self.config = ConnectionConfig(
                MAIL_USERNAME=settings.MAIL_USERNAME,
                MAIL_PASSWORD=settings.MAIL_PASSWORD,
                MAIL_FROM=settings.MAIL_FROM,
                MAIL_PORT=settings.MAIL_PORT,
                MAIL_SERVER=settings.MAIL_SERVER,
                MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
                MAIL_STARTTLS=settings.MAIL_STARTTLS,
                USE_CREDENTIALS=True
            )
        self.fastmail = FastMail(self.config)

    async def send_verification_email(self, email: EmailStr, token: str):
        """Send verification email to user."""
        if not settings.EMAIL_ENABLED:
            # Skip sending email if disabled
            return

        template = env.get_template('verification.html')
        verify_url = f"{settings.FRONTEND_URL}/verify?token={token}"
        html = template.render(verify_url=verify_url)

        message = MessageSchema(
            subject="Verify your email",
            recipients=[email],
            body=html,
            subtype="html"
        )
        await self.fastmail.send_message(message)

    async def send_password_reset_email(self, email: EmailStr, token: str):
        """Send password reset email to user."""
        template = env.get_template('password_reset.html')
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        html = template.render(reset_url=reset_url)

        message = MessageSchema(
            subject="Reset your password",
            recipients=[email],
            body=html,
            subtype="html"
        )
        await self.fastmail.send_message(message)

    async def send_account_locked_email(self, email: EmailStr, unlock_time: str):
        """Send account locked notification email."""
        template = env.get_template('account_locked.html')
        html = template.render(unlock_time=unlock_time)

        message = MessageSchema(
            subject="Account Temporarily Locked",
            recipients=[email],
            body=html,
            subtype="html"
        )
        await self.fastmail.send_message(message) 