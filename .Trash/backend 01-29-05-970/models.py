from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TimelineEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(50), nullable=False)
    icon = db.Column(db.String(50))  # Optional: icon class name or type
    details = db.Column(db.Text)  # New field for detailed descriptions