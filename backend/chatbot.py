import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "llama3.2"

SYSTEM_PROMPT = """You are a resume analysis assistant. You help users understand resumes.
You have been given the content of a resume. Answer questions about:
- What skills the candidate has
- Their work experience, education, certifications
- Overall suitability for specific roles
- Any other resume-related questions

Be concise, accurate, and helpful. Base your answers strictly on the resume content provided."""


def ask_about_resume(resume_text: str, user_message: str, history: list = None) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"Here is the resume content:\n\n{resume_text}"},
    ]

    if history:
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": user_message})

    payload = {
        "model": MODEL,
        "messages": messages,
        "stream": False,
        "options": {"temperature": 0.7},
    }
    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    data = response.json()
    return data["message"]["content"]
