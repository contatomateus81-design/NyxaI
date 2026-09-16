from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Conversation, Message, User
from services.ai import ai_service

router = APIRouter(prefix="/conversations", tags=["Conversations"])

class MessageCreate(BaseModel):
    content: str
    role: str = "user"

class MessageResponse(BaseModel):
    id: int
    content: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: Optional[str] = None

class ConversationResponse(BaseModel):
    id: int
    title: str
    user_id: int
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []
    
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    system_prompt: Optional[str] = "Você é um assistente de IA prestativo e inteligente chamado Nyx."

@router.post("/", response_model=ConversationResponse)
def create_conversation(request: ChatRequest, db: Session = Depends(get_db)):
    """Cria uma nova conversa"""
    
    # Gera um título se não foi fornecido
    title = request.system_prompt or "Nova Conversa"
    
    conversation = Conversation(
        title=title,
        user_id=1  # TODO: Obter do token de autenticação
    )
    
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    # Adiciona a primeira mensagem
    if request.message:
        message = Message(
            content=request.message,
            role="user",
            conversation_id=conversation.id
        )
        db.add(message)
        db.commit()
    
    return conversation

@router.get("/", response_model=List[ConversationResponse])
def list_conversations(db: Session = Depends(get_db)):
    """Lista todas as conversas"""
    conversations = db.query(Conversation).all()
    return conversations

@router.get("/{conversation_id}", response_model=ConversationResponse)
def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Obtém uma conversa específica"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    return conversation

@router.post("/{conversation_id}/message", response_model=MessageResponse)
def send_message(conversation_id: int, request: ChatRequest, db: Session = Depends(get_db)):
    """Envia uma mensagem e recebe uma resposta da IA"""
    
    # Verifica se a conversa existe
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    # Adiciona a mensagem do usuário
    user_message = Message(
        content=request.message,
        role="user",
        conversation_id=conversation_id
    )
    db.add(user_message)
    db.commit()
    
    # Obtém o histórico da conversa
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).all()
    formatted_messages = [
        {"role": msg.role, "content": msg.content}
        for msg in messages
    ]
    
    # Gera a resposta da IA
    response = ai_service.generate_response(
        messages=formatted_messages,
        system_prompt=request.system_prompt
    )
    
    if response["success"]:
        # Adiciona a resposta da IA
        assistant_message = Message(
            content=response["content"],
            role="assistant",
            conversation_id=conversation_id
        )
        db.add(assistant_message)
        
        # Atualiza o título se for a primeira mensagem
        if len(messages) == 1:
            title = ai_service.generate_title(request.message)
            conversation.title = title
        
        db.commit()
        db.refresh(assistant_message)
        
        return assistant_message
    else:
        raise HTTPException(status_code=500, detail=f"Erro na IA: {response['error']}")

@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Exclui uma conversa"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    db.delete(conversation)
    db.commit()
    
    return {"message": "Conversa excluída com sucesso"}
