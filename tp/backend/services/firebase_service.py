import os
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, auth

BASE_DIR = Path(__file__).resolve().parent.parent

try:
    if not firebase_admin._apps:
        credentials_path = os.environ.get("FIREBASE_CREDENTIALS") or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        if credentials_path:
            credential_file = Path(credentials_path)
            if not credential_file.is_absolute():
                credential_file = BASE_DIR / credential_file
            firebase_admin.initialize_app(credentials.Certificate(str(credential_file)))
        else:
            print("Warning: FIREBASE_CREDENTIALS not set. Firestore is disabled.")
    
    if firebase_admin._apps:
        db = firestore.client()
    else:
        db = None
except Exception as e:
    print(f"Warning: Firebase Admin SDK failed to initialize: {e}")
    db = None

def get_db():
    return db

def verify_token(id_token: str):
    """Verifies a Firebase ID token and returns the decoded token."""
    if not firebase_admin._apps:
        return {"uid": "mock-user-id", "role": "FARMER"} # Mock for now
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None

def get_user_role(uid: str) -> str:
    """Fetches the user's role from the 'users' collection."""
    if not db:
        return "FARMER" # Mock for now
    try:
        doc = db.collection('users').document(uid).get()
        if doc.exists:
            return doc.to_dict().get('role', 'UNKNOWN')
        return "UNKNOWN"
    except Exception as e:
        print(f"Failed to get user role: {e}")
        return "UNKNOWN"
