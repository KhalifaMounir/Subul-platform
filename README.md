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

```
subul/
├── app.py               # Main application entry point
├── models.py            # Database models
├── README.md            # Project documentation
├── /templates/          # HTML templates
├── /static/             # Static files (CSS/JS)
├── /assets/             # ThemeWagon assets
├── /ai/                 # Future AI features
```

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
