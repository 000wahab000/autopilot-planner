from datetime import datetime, timedelta

def generate_plan(tasks):
    plan = []
    t = datetime.strptime("09:00", "%H:%M")
    for task in tasks:
        start = t.strftime("%H:%M")
        duration = float(task.get("duration", 1))
        t += timedelta(hours=duration)
        end = t.strftime("%H:%M")
        plan.append({"title": task["title"], "start": start, "end": end})
    return plan
