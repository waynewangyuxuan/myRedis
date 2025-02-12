import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, TimelineEvent  # Import db and model
from routes.timeline import timeline
from scripts.seed import seed_data  # Import seed_data function

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL", "sqlite:///site.db")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)

    # Register blueprints
    app.register_blueprint(timeline)

    @app.route('/')
    def home():
        return {"message": "Welcome to my personal website backend!"}

    # Add CLI command for seeding
    @app.cli.command("seed")
    def seed():
        """Seed the database with initial data."""
        seed_data(app, db)

    return app

# This ensures Gunicorn can run the app
app = create_app()