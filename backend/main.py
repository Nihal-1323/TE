import os
import shutil
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

from app.rag.pipeline import RagPipeline

load_dotenv()

app = FastAPI(title="Smart Multi-Modal Education Tutor API", version="1.2.4")

# CORS middleware to allow cross-origin requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = RagPipeline()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class QueryRequest(BaseModel):
    query: str = Field(..., description="The student's question or search query")
    session_id: Optional[str] = Field("default", description="Active learning session ID")

class QueryResponse(BaseModel):
    answer: str
    explanation: str
    thought_process: Optional[str] = None
    sources: List[Dict[str, Any]]
    graph_data: Dict[str, Any]

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Smart Multi-Modal Tutor API",
        "version": "1.2.4",
        "active_documents": len(pipeline.documents),
        "graph_nodes_count": len(pipeline.graph_nodes)
    }

@app.get("/documents")
async def list_documents():
    """Returns the list of ingested educational materials."""
    return {"documents": pipeline.documents}

@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    metadata: Optional[str] = Form(None)
):
    """
    Handles PDF, Image, and Audio file uploads.
    Saves document and registers in the RAG ingestion pipeline.
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        doc_entry = pipeline.add_document(
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            file_path=file_path
        )
        
        return {
            "message": f"Successfully ingested {file.filename}",
            "filename": file.filename,
            "content_type": file.content_type,
            "status": "complete",
            "document": doc_entry
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process upload: {str(e)}")

@app.post("/query", response_model=QueryResponse)
async def query_tutor(payload: QueryRequest):
    """
    Main Multi-Modal RAG endpoint:
    1. Embed query
    2. Hybrid vector search & Neo4j graph traversal
    3. Cross-Encoder reranking
    4. Grounded answer generation + reasoning
    """
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = pipeline.process_query(query=payload.query, session_id=payload.session_id or "default")
    return result

@app.get("/graph")
async def get_full_graph():
    """
    Returns the knowledge graph structure for visualization.
    """
    return pipeline.get_graph()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
