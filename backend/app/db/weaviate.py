import weaviate
import os

def init_weaviate_schema(client: weaviate.Client):
    """
    Define the schema for educational content in Weaviate.
    Includes text, image (CLIP), and audio (Whisper) metadata.
    """
    class_obj = {
        "class": "EducationContent",
        "description": "Educational material including PDF chunks, image OCR, and audio transcripts.",
        "vectorizer": "text2vec-openai", # Or custom local transformer
        "moduleConfig": {
            "text2vec-openai": {
                "model": "ada",
                "modelVersion": "002",
                "type": "text"
            }
        },
        "properties": [
            {
                "name": "text",
                "dataType": ["text"],
                "description": "The actual content or transcript",
            },
            {
                "name": "source",
                "dataType": ["string"],
                "description": "File name or URL of the source",
            },
            {
                "name": "modality",
                "dataType": ["string"],
                "description": "Type: text, image, or audio",
            },
            {
                "name": "embedding_type",
                "dataType": ["string"],
                "description": "Service used: CLIP, Whisper, or SentenceTransformers",
            }
        ]
    }

    if not client.schema.contains(class_obj):
        client.schema.create_class(class_obj)
        print("Schema created successfully.")
    else:
        print("Schema already exists.")
