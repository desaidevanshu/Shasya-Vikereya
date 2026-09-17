"""
KrishiClear LiveKit WebRTC Voice Service.
Issues secure WebRTC room tokens for farmers and agents.
"""
import os
from typing import Dict, Any, Optional
from livekit.api import AccessToken, VideoGrants

class LiveKitService:
    def __init__(self):
        self.url = os.environ.get("LIVEKIT_URL", "")
        self.api_key = os.environ.get("LIVEKIT_API_KEY", "")
        self.api_secret = os.environ.get("LIVEKIT_API_SECRET", "")

    def is_configured(self) -> bool:
        return bool(self.url and self.api_key and self.api_secret)

    def create_token(
        self,
        room_name: str = "kisan-room",
        identity: Optional[str] = None,
        name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generates a signed JWT WebRTC join token for a client."""
        if not self.is_configured():
            return {
                "success": False,
                "error": "LiveKit credentials not configured in environment or .env",
                "configured": False
            }

        user_identity = identity or f"farmer-{os.urandom(3).hex()}"
        user_name = name or "KrishiClear Farmer"

        token = (
            AccessToken(self.api_key, self.api_secret)
            .with_identity(user_identity)
            .with_name(user_name)
            .with_grants(
                VideoGrants(
                    room_join=True,
                    room=room_name,
                    can_publish=True,
                    can_subscribe=True,
                    can_publish_data=True
                )
            )
            .to_jwt()
        )

        return {
            "success": True,
            "configured": True,
            "server_url": self.url,
            "token": token,
            "room_name": room_name,
            "identity": user_identity,
            "participant_name": user_name
        }

    def get_status(self) -> Dict[str, Any]:
        """Returns LiveKit connection readiness status."""
        configured = self.is_configured()
        masked_key = f"{self.api_key[:6]}...{self.api_key[-3:]}" if len(self.api_key) > 8 else "***"
        return {
            "configured": configured,
            "server_url": self.url if configured else None,
            "masked_key": masked_key if configured else None,
            "engine": "LiveKit Cloud WebRTC",
            "voice_brain": "Google Gemini 3.6 Flash Native Audio"
        }

livekit_service = LiveKitService()
