"""
KrishiClear Neural Text-to-Speech (Edge-TTS) Service.
Generates human-like, studio-quality speech in Marathi, Hindi, and English.
Requires zero keys, zero character caps, and strips all markdown formatting so
it never reads asterisks or hashtags out loud.
"""
import re
import asyncio
import edge_tts
from typing import Dict, Any, Optional

class EdgeTtsService:
    VOICES = {
        "mr": "mr-IN-AarohiNeural",   # Authentic warm Marathi female
        "hi": "hi-IN-SwaraNeural",    # Natural empathetic Hindi female
        "en": "en-IN-NeerjaNeural"    # Clear Indian English
    }

    FALLBACK_MALE_VOICES = {
        "mr": "mr-IN-ManoharNeural",
        "hi": "hi-IN-MadhurNeural",
        "en": "en-IN-PrabhatNeural"
    }

    def clean_text_for_speech(self, raw_text: str) -> str:
        """Strips markdown asterisks, hashtags, bullets, and URLs so speech sounds natural."""
        if not raw_text:
            return ""
        # Remove bold, italics, code markdown symbols (*, _, #, `, ~)
        text = re.sub(r'[*_#`~>]', '', raw_text)
        # Remove bullet points and dashes
        text = re.sub(r'[•\-\+]', ' ', text)
        # Remove URLs
        text = re.sub(r'https?://\S+', '', text)
        # Remove markdown links, keep text: [link text](url) -> link text
        text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    async def generate_audio_bytes(self, text: str, lang: str = "hi", voice: Optional[str] = None) -> bytes:
        """Generates MP3 audio bytes using Microsoft Neural edge-tts."""
        clean_text = self.clean_text_for_speech(text)
        if not clean_text:
            return b""

        selected_voice = voice or self.VOICES.get(lang, self.VOICES["hi"])
        communicate = edge_tts.Communicate(clean_text, selected_voice)

        audio_chunks = []
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_chunks.append(chunk["data"])

        return b"".join(audio_chunks)

    def get_status(self) -> Dict[str, Any]:
        return {
            "available": True,
            "engine": "Microsoft Edge Neural TTS",
            "voices": self.VOICES,
            "pricing": "100% Free / Unlimited",
            "sanitizer": "Active (Zero Asterisks)"
        }

edge_tts_service = EdgeTtsService()
