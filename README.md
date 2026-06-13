# Resume AI Chatbot

Upload a resume (PDF/DOCX) and ask questions about the candidate's skills, experience, and qualifications using AI.

## Project Structure

```
├── backend/          # FastAPI Python backend
│   ├── main.py        # API endpoints
│   ├── chatbot.py     # OpenAI chat logic
│   ├── resume_parser.py  # PDF/DOCX text extraction
│   └── requirements.txt
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx    # Main app component
│   │   └── App.css    # Styles
│   └── package.json
└── README.md
```

## Setup

### Backend

1. Navigate to backend: `cd backend`
2. Create virtual env: `python -m venv .venv`
3. Activate: `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (macOS/Linux)
4. Install: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and add your OpenAI API key
6. Run: `uvicorn main:app --reload`

### Frontend

1. Navigate to frontend: `cd frontend`
2. Install: `npm install`
3. Run: `npm run dev`

Open http://localhost:5173 in your browser.
