# Backgammon Game Backend

FastAPI backend for the online backgammon game.

## Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/backgammon
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. Run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation will be available at `http://localhost:8000/docs`

## Project Structure

```
backend/
├── app/
│   ├── api/            # API endpoints
│   │   └── v1/        # API version 1
│   ├── core/          # Core game logic
│   │   ├── game.py    # Game mechanics
│   │   └── config.py  # Configuration
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic
│   └── main.py        # FastAPI application
└── requirements.txt
```

## API Endpoints (Planned)

- `/api/v1/auth/`: Authentication endpoints
- `/api/v1/games/`: Game management
- `/api/v1/users/`: User management
- `/ws/game/{game_id}`: WebSocket endpoint for game updates
