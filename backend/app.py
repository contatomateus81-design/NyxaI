from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
from routes import auth, conversations

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# Configura CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(conversations.router, prefix=settings.API_V1_PREFIX)

@app.on_event("startup")
async def startup_event():
    """Inicializa o banco de dados"""
    init_db()

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "message": "Bem-vindo à API do Nyx"
    }

@app.get("/health")
async def health_check():
    """Verifica a saúde da API"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
