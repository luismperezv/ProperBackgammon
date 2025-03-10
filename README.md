# Backgammon Online Game

A feature-rich online backgammon application with real-time multiplayer support.

## Project Structure
```
.
├── backend/             # FastAPI backend
│   ├── app/
│   │   ├── api/        # API endpoints
│   │   ├── core/       # Core game logic
│   │   ├── models/     # Database models
│   │   ├── schemas/    # Pydantic schemas
│   │   └── services/   # Business logic
│   └── requirements.txt # Python dependencies
└── frontend/           # React frontend
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── styles/     # CSS styles
    │   └── utils/      # Utility functions
    └── package.json    # Node.js dependencies
```

## Prerequisites

1. Python 3.8 or higher
2. Node.js 16 or higher
3. PostgreSQL (optional for initial setup)

## Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

## Frontend Setup

1. Install Node.js from: https://nodejs.org/

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Development Status

- [x] Initial project structure
- [ ] Backend game logic
- [ ] Frontend UI components
- [ ] Real-time communication
- [ ] User authentication
- [ ] Database integration 