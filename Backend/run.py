import os
from flask import Flask, render_template


template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "Frontend", "templates")
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, "Frontend", "static")

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000)
