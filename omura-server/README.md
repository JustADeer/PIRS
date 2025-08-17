# Omura Server

This is a FastAPI server for handling report data and login functionality, using SQLite for storage.

## Requirements
- Python 3.11+
- [Poetry](https://python-poetry.org/) for dependency management

## Setup & Usage

### 1. Install Poetry
If you don't have Poetry installed, run:
```
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```
Or see the official docs: https://python-poetry.org/docs/#installation

### 2. Install dependencies
Navigate to the project directory and run:
```
poetry install
```

### 3. Run the server
Start the server using Poetry:
```
poetry run python main.py
```

The server will start on `http://0.0.0.0:8000` if you are in the correct directory.

### 4. API Endpoints
- `POST /reports` — Add a report (image, text, location)
- `GET /reports` — Get all reports
- `DELETE /report/{id}` — Delete a report by ID
- `POST /login` — Login (admin/gov/user)
- `GET /login` — Get login data (for testing)

### 5. Database
The server uses `omura.db` (SQLite) and will create the database/table automatically if not present.

---
For more details, see the code in `main.py`.
