# 📚 Subul – Online Learning Platform

**Subul** is a Flask-based web application that offers paid courses, quizzes, and modular learning paths. The platform integrates with AWS and AI tools to create a smart, interactive learning experience.

---

## 🚀 Features

- 🔐 User authentication with secure sessions
- 💳 Access to paid courses
- 🧩 Courses divided into modules and quizzes
- 📝 Quiz handling and scoring (planned)
- ☁️ AWS integration for media storage
- 🤖 AI-ready module folder for future enhancement
- 📊 Progress tracking per course
- 📱 Responsive UI from a ThemeWagon template

---

## 🛠️ Technologies Used

| Category     | Tools/Frameworks                           |
|--------------|---------------------------------------------|
| Backend      | Flask, Flask-SQLAlchemy, Flask-Login        |
| Forms/Auth   | Flask-WTF, python-dotenv                    |
| Cloud        | AWS (S3 via Boto3)                          |
| Web Scraping | Requests, BeautifulSoup4                    |
| Deployment   | Gunicorn                                    |
| Frontend     | Jinja2, HTML/CSS (from ThemeWagon)          |

---

## 📁 Project Structure

subul-platform/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory and setup
│   │   ├── forms.py             # WTForms classes
│   │   ├── generate.py          # (your custom module)
│   │   ├── models.py            # Database models
│   │   ├── routes.py            # Flask routes / API endpoints
│   │   ├── services.py          # Business logic / service layer
│   │   ├── utils.py             # Utility/helper functions
│   ├── migrations/              # Alembic migrations folder
│   ├── uploads/                 # Uploaded files storage
│   ├── .env                    # Environment variables
│   ├── config.py                # Configuration settings
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                   # Flask app entry point
│
├── frontend/
│   ├── .next/                   # Next.js build artifacts
│   ├── components/              # React components
│   ├── pages/                   # Next.js pages (routes)
│   ├── public/                  # Public assets (images, favicon)
│   ├── styles/                  # CSS/SCSS stylesheets
│   ├── utils/                   # JS utility functions
│   ├── next.config.js           # Next.js config
│   ├── package.json             # Node dependencies
│   ├── package-lock.json        # Locked node modules
│
├── .gitignore                   # Git ignore file
├── LICENSE                     # Project license
├── README.md                   # Project documentation


> 🔹 Note: Empty folders are tracked using `.gitkeep` files.

---

## ✅ Setup Instructions (Windows)

### 1. Clone the Repository

```bash
git clone https://github.com/SMARTOVATEAI/subul-platform.git
cd subul-platform
```

### 2. Create and Activate a Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Create the `.env` File





### 5. Database Setup: PostgreSQL & pgAdmin4 : Use pgAdmin4 to browse and manage your database visually
flask db upgrade       # Apply migrations
### 5. Run the Application

```bash
flask run
```

Visit [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📦 Dependencies

Main packages used:

- `flask`
- `flask_sqlalchemy`
- `flask_login`
- `flask_wtf`
- `python-dotenv`
- `boto3`
- `requests`
- `beautifulsoup4`
- `gunicorn`

> Install with:
```bash
pip install -r requirements.txt
```
