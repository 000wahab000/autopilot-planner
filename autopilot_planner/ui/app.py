import os
from flask import Flask, render_template
from flask_cors import CORS

BASE = os.path.dirname(__file__)
TEMPLATES = os.path.join(BASE, "templates")
STATIC = os.path.join(BASE, "static")

app = Flask(__name__, template_folder=TEMPLATES, static_folder=STATIC, static_url_path="/static")
CORS(app)

from autopilot_planner.server.api import api_bp
app.register_blueprint(api_bp, url_prefix="/api")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/add")
def add():
    return render_template("add.html")

@app.route("/plan")
def plan():
    return render_template("plan.html")

@app.route("/calendar")
def calendar():
    return render_template("calendar.html")

if __name__ == "__main__":
    app.run(debug=True)
