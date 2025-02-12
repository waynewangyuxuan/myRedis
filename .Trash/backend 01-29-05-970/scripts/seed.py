from models import TimelineEvent

def seed_data(app, db):
    """Function to seed the database with initial timeline events, including details."""
    events = [
        {
            "title": "Started College",
            "description": "Began my computer science degree at NYU.",
            "date": "September 2021",
            "icon": "graduation-cap",
            "details": "Enrolled in the Computer Science program at NYU. Took courses in algorithms, data structures, and artificial intelligence."
        },
        {
            "title": "Internship at Oracle",
            "description": "Worked as a software engineering intern.",
            "date": "Summer 2023",
            "icon": "briefcase",
            "details": "Developed microservices for Oracle Cloud, optimized backend performance, and collaborated with cross-functional teams."
        },
        {
            "title": "Graduated College",
            "description": "Completed my undergraduate degree in computer science.",
            "date": "May 2025",
            "icon": "graduation-cap",
            "details": "Received a Bachelor's in Computer Science from NYU with a focus on artificial intelligence and distributed systems."
        }
    ]

    with app.app_context():
        for event_data in events:
            event = TimelineEvent(**event_data)
            db.session.add(event)

        db.session.commit()
        print("Database seeded successfully with details!")