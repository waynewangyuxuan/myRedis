from flask import Blueprint, jsonify, request
from models import db, TimelineEvent

timeline = Blueprint('timeline', __name__)

# READ: Get all timeline events
@timeline.route('/api/timeline', methods=['GET'])
def get_timeline():
    events = TimelineEvent.query.all()
    timeline_data = [
        {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "icon": event.icon,
            "details":event.details
        }
        for event in events
    ]
    return jsonify(timeline_data)

# CREATE: Add a new timeline event
@timeline.route('/api/timeline', methods=['POST'])
def add_timeline_event():
    data = request.json
    new_event = TimelineEvent(
        title=data['title'],
        description=data['description'],
        date=data['date'],
        icon=data.get('icon', '')
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({"message": "Event added successfully!"}), 201

# UPDATE: Edit a timeline event
@timeline.route('/api/timeline/<int:event_id>', methods=['PUT'])
def update_timeline_event(event_id):
    data = request.json
    event = TimelineEvent.query.get_or_404(event_id)
    event.title = data['title']
    event.description = data['description']
    event.date = data['date']
    event.icon = data.get('icon', event.icon)
    db.session.commit()
    return jsonify({"message": "Event updated successfully!"})

# DELETE: Remove a timeline event
@timeline.route('/api/timeline/<int:event_id>', methods=['DELETE'])
def delete_timeline_event(event_id):
    event = TimelineEvent.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted successfully!"})