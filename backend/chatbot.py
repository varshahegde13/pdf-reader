import requests
import json

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "llama3.2"

SYSTEM_PROMPT = """You are a resume analysis assistant. You help users understand resumes.
You have been given the content of a resume. Answer questions about:
- What skills the candidate has
- Their work experience, education, certifications
- Overall suitability for specific roles
- Any other resume-related questions

Be concise, accurate, and helpful. Base your answers strictly on the resume content provided."""


def ask_about_resume(resume_text: str, user_message: str) -> str:
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Here is the resume content:\n\n{resume_text}\n\n---\n\n{user_message}"},
        ],
        "stream": False,
        "options": {"temperature": 0.3},
    }
    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    data = response.json()
    return data["message"]["content"]
