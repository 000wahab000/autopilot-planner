def get_suggestions(tasks):
    return [
        {"title": "Short Break", "duration": 0.5},
        {"title": "Deep Work", "duration": 2},
        {"title": "Review Notes", "duration": 1},
        {"title": "Exercise", "duration": 1.5}
    ]

def ai_chat_reply(message, tasks):
    if not message:
        return "Tell me something and I'll help."
    if "math" in message.lower():
        return "Break the math problem into small steps and solve one at a time."
    return "Focus on one task at a time and stay consistent."
