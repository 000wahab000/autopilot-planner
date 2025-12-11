import os, json
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from autopilot_planner.agents.planner import generate_plan
from autopilot_planner.agents.ai_agent import get_suggestions, ai_chat_reply

api_bp = Blueprint("api", __name__)

DATA = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "tasks.json")

def load():
    if not os.path.exists(DATA):
        os.makedirs(os.path.dirname(DATA), exist_ok=True)
        with open(DATA, "w") as f:
            json.dump({"tasks": []}, f)
    with open(DATA, "r") as f:
        return json.load(f)

def save(d):
    with open(DATA, "w") as f:
        json.dump(d, f, indent=2)

@api_bp.route("/tasks", methods=["GET"])
@cross_origin()
def get_tasks():
    return jsonify(load())

@api_bp.route("/tasks", methods=["POST"])
@cross_origin()
def add_task():
    body = request.get_json() or {}
    title = body.get("title")
    duration = float(body.get("duration", 1))
    if not title:
        return jsonify({"error": "title required"}), 400
    data = load()
    data["tasks"].append({"title": title, "duration": duration})
    save(data)
    return jsonify({"status": "ok"})

@api_bp.route("/tasks/<int:i>", methods=["DELETE"])
@cross_origin()
def delete_task(i):
    data = load()
    try:
        data["tasks"].pop(i)
        save(data)
        return jsonify({"status": "deleted"})
    except:
        return jsonify({"error": "invalid index"}), 400

@api_bp.route("/plan", methods=["GET"])
@cross_origin()
def plan():
    tasks = load().get("tasks", [])
    return jsonify({"plan": generate_plan(tasks)})

@api_bp.route("/ai/suggestions", methods=["POST"])
@cross_origin()
def suggest():
    tasks = request.get_json().get("tasks", [])
    return jsonify({"suggestions": get_suggestions(tasks)})

@api_bp.route("/ai/chat", methods=["POST"])
@cross_origin()
def chat():
    body = request.get_json() or {}
    msg = body.get("message", "")
    tasks = body.get("tasks", [])
    reply = ai_chat_reply(msg, tasks)
    return jsonify({"reply": reply})
