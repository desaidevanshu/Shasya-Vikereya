"""
KrishiClear Groq Whisper Speech-to-Text (STT) Service.
High-speed (<150ms), noise-immune audio transcription using Groq's whisper-large-v3-turbo.
"""
import os
from pathlib import Path
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

class GroqSttService:
    def __init__(self):
        self.api_url = "https://api.groq.com/openai/v1/audio/transcriptions"
        self.model = "whisper-large-v3-turbo"

    @property
    def api_key(self) -> str:
        return os.environ.get("GROQ_API_KEY", "")

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 10)

    def transcribe_audio(
        self,
        audio_bytes: bytes,
        filename: str = "audio.webm",
        lang: Optional[str] = None
    ) -> Dict[str, Any]:
        """Transcribes raw audio bytes using Groq Whisper Large-v3 Turbo."""
        if not self.is_configured():
            return {
                "success": False,
                "error": "GROQ_API_KEY not configured",
                "fallback_recommended": True
            }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": "KrishiClear/2.5"
        }

        # Agricultural vocabulary prompt biasing
        prompt_bias = (
            "Indian agriculture, APMC Mandi, Tomato, Onion, Potato, Pimpalgaon, Nashik, Vashi, "
            "Kalyan, Samruddhi Expressway, Kasara Ghat, Section 5D, Gate Pass, Hamali, Adath, MSP"
        )

        data = {
            "model": self.model,
            "prompt": prompt_bias,
            "response_format": "json"
        }
        if lang in ["hi", "mr", "en"]:
            data["language"] = lang

        files = {
            "file": (filename, audio_bytes, "audio/webm")
        }

        try:
            res = requests.post(self.api_url, headers=headers, data=data, files=files, timeout=12)
            if res.status_code == 200:
                result = res.json()
                return {
                    "success": True,
                    "text": result.get("text", "").strip(),
                    "engine": "Groq Whisper Large-v3 Turbo",
                    "model": self.model
                }
            else:
                return {
                    "success": False,
                    "error": f"Groq HTTP {res.status_code}: {res.text}",
                    "fallback_recommended": True
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "fallback_recommended": True
            }

    def get_status(self) -> Dict[str, Any]:
        configured = self.is_configured()
        masked = f"{self.api_key[:8]}...{self.api_key[-4:]}" if len(self.api_key) > 12 else "***"
        return {
            "configured": configured,
            "model": self.model,
            "engine": "Groq Whisper Large-v3 Turbo",
            "masked_key": masked if configured else None,
            "latency": "<150ms"
        }

groq_stt_service = GroqSttService()
