import { useState, useRef, useEffect } from 'react'

function App() {
  const [resumeText, setResumeText] = useState('')
  const [filename, setFilename] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/upload', { method: 'POST', body: formData })
      const data = await res.json()
      setResumeText(data.text)
      setFilename(data.filename)
      setMessages([
        { role: 'bot', text: `Got it! I've read **${data.filename}**. Ask me anything about the skills, experience, or qualifications in this resume.` },
      ])
    } catch {
      setMessages([{ role: 'bot', text: 'Failed to upload resume. Make sure the backend server is running.' }])
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleUpload(file)
  }

  const handleSend = async () => {
    if (!input.trim() || !resumeText) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, message: userMsg }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Error getting response. Check backend connection.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="app">
      <h1>Resume AI Chatbot</h1>

      <div className="upload-section">
        {!resumeText ? (
          <div
            className={`drop-zone ${dragOver ? 'dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="icon">📄</div>
            <p><strong>Click or drag</strong> your resume here (PDF or DOCX)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              hidden
              onChange={(e) => handleUpload(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="file-info">
            Uploaded: <strong>{filename}</strong>
            <button
              onClick={() => { setResumeText(''); setFilename(''); setMessages([]) }}
              style={{
                marginLeft: 16,
                padding: '4px 12px',
                background: '#ff5252',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>
        )}
        {uploading && <p style={{ marginTop: 12, color: '#666' }}>Parsing resume...</p>}
      </div>

      <div className="chat-section">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="placeholder">
              <div style={{ fontSize: '2rem' }}>💬</div>
              <p>Upload a resume to start asking questions</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="bubble">{msg.text}</div>
              </div>
            ))
          )}
          {loading && (
            <div className="message bot">
              <div className="bubble">Thinking<span className="loading-dots" /></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={resumeText ? 'Ask about the resume...' : 'Upload a resume first...'}
            disabled={!resumeText || loading}
          />
          <button onClick={handleSend} disabled={!resumeText || loading || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
