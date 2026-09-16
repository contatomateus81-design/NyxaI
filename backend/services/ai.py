from openai import OpenAI
from config import settings

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
    
    async def generate_response(self, messages: list, system_prompt: str = None):
        """Gera uma resposta usando a API da OpenAI"""
        
        formatted_messages = []
        
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        
        formatted_messages.extend(messages)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=formatted_messages,
                max_tokens=1024,
                temperature=0.7
            )
            
            return {
                "success": True,
                "content": response.choices[0].message.content,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def generate_title(self, message: str) -> str:
        """Gera um título para uma conversa baseado na primeira mensagem"""
        
        prompt = f"Crie um título curto (máximo 5 palavras) para esta conversa:\n\n{message[:200]}"
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=30,
                temperature=0.5
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            return "Nova Conversa"

ai_service = AIService()
