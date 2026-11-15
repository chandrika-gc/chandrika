# G. Chandrika - Modern Portfolio Website

A clean, bright, and minimal personal portfolio website for **G. Chandrika (Chandrika Gajjala)**, student at **Jain (Deemed-to-be University)**, featuring official LinkedIn Learning certifications, technical skillset, projects, and an interactive contact form.

---

## 🌟 Key Features

- **Bright & Minimal Modern Aesthetic**: Clean typography, crisp contrast, refined cards, subtle drop shadows, and responsive glassmorphism navigation.
- **Official LinkedIn Learning Certifications**:
  1. **Learning Graph Neural Networks** (Sep 29, 2026 • 2h 13m)
     - Skills: Neural Networks, Graph Networks, Artificial Intelligence (AI)
     - Certificate ID: `97a0fcfa663445d65582c7fe98191771c4379d38bc4e7063adc2a387c4f62f99`
  2. **Programming Foundations: Discrete Mathematics** (Sep 29, 2026 • 3h 9m)
     - Skills: Discrete Mathematics, Programming Foundations
     - Certificate ID: `9a18d71c63e3a1159260523a0bd5fb8e29e18c7937c343a9370a1fc249d83e31`
- **Interactive Lightbox Modal**: View certificates in high definition (3300x2550) with 1-click Certificate ID copying and direct PDF download links.
- **Interactive Contact Form**:
  - Validates user input in real-time.
  - Submits asynchronously to the local backend `/api/contact`.
  - Stores all incoming messages in `data/messages.json`.
- **Light / Dark Mode**: Built-in toggle supporting bright day mode and sleek evening mode with `localStorage` memory.
- **Zero Heavy Dependencies**: Pure semantic HTML5, modern CSS3 with custom variables, and vanilla JavaScript.

---

## 🚀 How to Run Locally

You can run the portfolio with the included Python 3 server:

```powershell
# Navigate to the project directory
cd C:\Users\gchan\.gemini\antigravity\scratch\chandrika-portfolio

# Start the server
py server.py
```

Then open your browser at:
👉 **[http://localhost:8000](http://localhost:8000)**

### API Endpoints
- `GET /`: The main portfolio website
- `POST /api/contact`: Accepts `{ name, email, subject, message }` and saves to `data/messages.json`
- `GET /api/messages`: View all saved contact inquiries
- `GET /health`: Health check endpoint

---

## 📁 Project Structure

```text
chandrika-portfolio/
├── index.html                 # Main portfolio markup
├── server.py                  # Python localhost web and API server
├── README.md                  # Project documentation
├── assets/
│   ├── css/
│   │   └── style.css          # Bright minimal modern styling & dark theme
│   ├── js/
│   │   └── main.js            # Interactivity, modal, contact AJAX, copy ID
│   └── images/
│       ├── cert-learning-graph-neural-networks.png
│       ├── cert-learning-graph-neural-networks.pdf
│       ├── cert-programming-foundations-discrete-mathematics.png
│       └── cert-programming-foundations-discrete-mathematics.pdf
└── data/
    └── messages.json          # Persisted messages received via contact form
```

---

## 🌐 Free Hosting / Deployment

When ready to host online, this repository can be deployed in 1 minute to:
- **GitHub Pages**: Push this folder to a GitHub repository and enable Pages under Settings > Pages.
- **Vercel / Netlify**: Connect the GitHub repo for automated deployments.
