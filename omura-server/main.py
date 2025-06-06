import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import datetime
import base64

import sqlite3
import os

DATABASE_URL : str = 'omura.db'
LOGINBASE_URL : str = 'login.db'

class Login(BaseModel):
    username: str
    password: str

class ReportDataResponse(BaseModel):
    id: int
    photo_data: str
    text: str
    latitude: float
    longitude: float
    timestamp: datetime.datetime
    # Add other fields as needed
    class Config:
        from_attributes=True

class ReportListResponse(BaseModel):
    data: List[ReportDataResponse]
    # Add other fields as needed

class DelReport(BaseModel):
    id: int

class GetReportData(BaseModel):
    id: int
    image: bytes
    text: str
    latitude: float
    longitude: float
    timestamp: datetime.datetime
    # Add other fields as needed
    class Config:
        from_attributes=True



api = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Only allow trusted origins
    allow_credentials=True,
    allow_methods=["*"],  # Only allow necessary HTTP methods
    allow_headers=["*"],  # Only allow required headers
)

report_data = {"reports": []}

def get_db_connection():
    """Dependency to get a database connection."""
    conn = sqlite3.connect(DATABASE_URL, check_same_thread=False)
    conn.row_factory = sqlite3.Row # Return rows that act like dictionaries
    try:
        yield conn # Provide the connection to the endpoint function
    finally:
        conn.close() # Ensure connection is closed afterwards

@api.get("/hellotest")
def index():
    return {"message": "Hello, World!"}

@api.post("/reports")
async def add_report(photo_data: UploadFile = File(...), text: str = Form(...), latitude: float = Form(...), longitude: float = Form(...), db: sqlite3.Connection = Depends(get_db_connection)):
    """
    Report data to the server.
    """
    try:
        contents = await photo_data.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading uploaded file: {e}")
    
    if not contents:
        raise HTTPException(status_code=400, detail="Recieved empty file")
    
    if photo_data.content_type and not photo_data.content_type.startswith("image/"):
        print(f"Warning: Received non-image file type: {photo_data.content_type}")

    print(f"Received file: {photo_data.filename}, Content-Type: {photo_data.content_type}, Size: {len(contents)}")
    print(f"Received text: {text}, lat: {latitude}, lon: {longitude}")

    try:
        inserted_id = insert_data(db, contents, text, latitude, longitude)
        return {
            "message": "Report added successfully",
            "filename": photo_data.filename,
            "report_id": inserted_id # Return the new ID
        }
    except HTTPException as e:
        # Propagate HTTPException raised by insert_data
        raise e
    except Exception as e:
        # Catch other unexpected errors during insertion
        print(f"Unexpected error during DB insertion: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred while saving the report.")

@api.get("/reports")
def get_report_data():
    """
    Get the report data from the database.
    """
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("SELECT id, photo_data, text, latitude, longitude, timestamp FROM report ORDER BY timestamp DESC")
    rows = c.fetchall()
    reports = []
    for row in rows:
        report = {
            "id": row[0],
            "photo_data": base64.b64encode(row[1]).decode('utf-8'),  # Encode binary data as Base64
            "text": row[2],
            "latitude": row[3],
            "longitude": row[4],
            "timestamp": row[5]
        }
        reports.append(report)
    conn.close()
    return reports

@api.delete("/report/{id}")
def del_report_data(id):
    """
    Delete a report by its ID.
    """
    try:
        delete_data(id)
        return {"message": f"Report with ID {id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while deleting the report: {e}")


@api.post("/login")
def post_login(login: Login) -> str:
    print("Received login data:", login)
    if login.username == "admin" and login.password == "admin":
        return "admin"
    elif login.username == "gov" and login.password == "gov":
        return "gov"
    elif login.username == "user" and login.password == "user":
        return "user"
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
@api.get("/login", response_model=Login)
def get_login_data():
    return {"username": "admin", "password": "admin"}

    
def create_database():
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS report (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            photo_data BLOB NOT NULL,
            text TEXT, 
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )""")
    conn.commit()
    conn.close()

def insert_data(db: sqlite3.Connection, photo_bytes: bytes, text: str, latitude: float, longitude: float):
    c = db.cursor()
    c.execute("INSERT INTO report (photo_data, text, latitude, longitude) VALUES (?, ?, ?, ?)",
              (photo_bytes, text, latitude, longitude))
    db.commit()

def retrieve_data():
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("SELECT * FROM report")
    rows = c.fetchall()
    for row in rows:
        print(row)
    conn.close()

def delete_data(id):
    conn = sqlite3.connect(DATABASE_URL)
    c = conn.cursor()
    c.execute("DELETE FROM report WHERE id=?", (id,))

    # Reorder the IDs to fill the gap
    c.execute("UPDATE report SET id = (SELECT COUNT(*) FROM report r2 WHERE r2.id <= report.id)")
    conn.commit()
    conn.close()


if __name__ == "__main__":
    # Only run the server if the script is in the specified directory
    EXPECTED_DIR = r"c:\Users\shaqu\Desktop\dumb projects\Untar\omura-server"
    current_dir = os.path.dirname(os.path.abspath(__file__))

    if current_dir == EXPECTED_DIR:
        uvicorn.run(api, host="0.0.0.0", port=8000)
        print("Checking and creating database...")
        create_database() # Ensure the database and table exist
    else:
        print(f"Not starting server: current directory '{current_dir}' does not match expected '{EXPECTED_DIR}'")