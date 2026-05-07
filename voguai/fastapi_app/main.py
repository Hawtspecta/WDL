from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
import re
import uvicorn
import time
import os

# ML imports for sentiment analysis
try:
    from textblob import TextBlob
    TEXTBLOB_AVAILABLE = True
except ImportError:
    TEXTBLOB_AVAILABLE = False
    print("TextBlob not available, using fallback sentiment analysis")

try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("Transformers not available, using TextBlob or fallback")

app = FastAPI(
    title="VogueAI Sentiment Analysis API",
    description="AI-powered fashion sentiment analysis and review processing",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Pydantic Models for Data Validation
class ReviewInput(BaseModel):
    product_id: int = Field(
        ..., 
        gt=0, 
        description="Product ID must be a positive integer",
        example=1
    )
    review_text: str = Field(
        ..., 
        min_length=10, 
        max_length=1000,
        description="Review text must be between 10 and 1000 characters",
        example="This dress is absolutely stunning! The fabric quality is excellent and it fits perfectly."
    )
    user_name: str = Field(
        ..., 
        min_length=2, 
        max_length=50,
        description="User name must be between 2 and 50 characters",
        example="Sarah Johnson"
    )
    rating: Optional[int] = Field(
        None,
        ge=1,
        le=5,
        description="Optional rating from 1 to 5 stars",
        example=5
    )
    
    @validator('user_name')
    def validate_user_name(cls, v):
        if not re.match(r'^[A-Za-z\s]+$', v):
            raise ValueError('User name can only contain letters and spaces')
        return v.strip().title()
    
    @validator('review_text')
    def validate_review_text(cls, v):
        if not v.strip():
            raise ValueError('Review text cannot be empty or just whitespace')
        return v.strip()

class SentimentResponse(BaseModel):
    sentiment: str = Field(..., description="Sentiment classification: POSITIVE, NEGATIVE, or NEUTRAL")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    label: str = Field(..., description="User-friendly recommendation label")
    product_id: int = Field(..., description="Product ID from the input")
    review_text: str = Field(..., description="Original review text")
    user_name: str = Field(..., description="User name from the input")
    timestamp: str = Field(..., description="Processing timestamp")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    model_loaded: bool = Field(..., description="Whether the ML model is loaded")
    version: str = Field(..., description="API version")
    timestamp: str = Field(..., description="Current timestamp")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    timestamp: str = Field(..., description="Error timestamp")

# Sample product database
products_db = {
    1: {"name": "Summer Essential Dress", "category": "Dresses"},
    2: {"name": "Business Elite Suit", "category": "Formal Wear"},
    3: {"name": "Evening Glamour Gown", "category": "Evening Wear"},
    4: {"name": "Casual Comfort Jeans", "category": "Casual Wear"},
    5: {"name": "Designer Handbag", "category": "Accessories"},
    6: {"name": "Silk Scarf Collection", "category": "Accessories"},
    7: {"name": "Vintage Leather Jacket", "category": "Outerwear"},
    8: {"name": "Floral Summer Top", "category": "Tops"},
    9: {"name": "Classic White Sneakers", "category": "Footwear"},
    10: {"name": "Elegant Watch", "category": "Accessories"}
}

# In-memory storage for reviews (in production, use a database)
reviews_storage: List[Dict[str, Any]] = []

# Global variables for ML models
sentiment_model = None
textblob_model = None
model_loaded = False
model_type = "fallback"  # Can be "transformers", "textblob", or "fallback"

@app.on_event("startup")
async def startup_event():
    """Initialize the application and load ML models on startup"""
    global sentiment_model, textblob_model, model_loaded, model_type
    
    print("VogueAI FastAPI starting up...")
    print("Loading ML sentiment analysis models...")
    
    # Try to load transformers model first (most accurate)
    if TRANSFORMERS_AVAILABLE:
        try:
            print("Loading HuggingFace transformers model...")
            sentiment_model = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                tokenizer="cardiffnlp/twitter-roberta-base-sentiment-latest"
            )
            model_type = "transformers"
            model_loaded = True
            print("✅ Transformers model loaded successfully!")
            return
        except Exception as e:
            print(f"❌ Failed to load transformers model: {e}")
    
    # Fallback to TextBlob
    if TEXTBLOB_AVAILABLE:
        try:
            print("Loading TextBlob model...")
            # TextBlob doesn't need explicit loading, just test it
            test_blob = TextBlob("This is a test")
            polarity = test_blob.sentiment.polarity
            model_type = "textblob"
            model_loaded = True
            print("✅ TextBlob model loaded successfully!")
            return
        except Exception as e:
            print(f"❌ Failed to load TextBlob: {e}")
    
    # Final fallback to keyword-based analysis
    print("⚠️  Using fallback keyword-based sentiment analysis")
    model_type = "fallback"
    model_loaded = True
    print("✅ Fallback model ready")

@app.get("/", response_model=Dict[str, Any])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "VogueAI Sentiment Analysis API",
        "version": "1.0.0",
        "description": "AI-powered fashion sentiment analysis",
        "endpoints": {
            "analyze": "/analyze - Analyze fashion review sentiment",
            "health": "/health - Check API health status",
            "docs": "/docs - Interactive API documentation",
            "reviews": "/reviews - Get all processed reviews"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify API and model status"""
    return HealthResponse(
        status="healthy" if model_loaded else "initializing",
        model_loaded=model_loaded,
        version="1.0.0",
        timestamp=datetime.now().isoformat()
    )

@app.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(review_input: ReviewInput):
    """
    Analyze sentiment of a fashion product review
    
    - **product_id**: Positive integer identifying the product
    - **review_text**: Review text (10-1000 characters)
    - **user_name**: Reviewer's name (2-50 characters, letters only)
    - **rating**: Optional rating from 1 to 5 stars
    
    Returns sentiment analysis with confidence score and recommendation.
    """
    start_time = datetime.now()
    
    # Validate product exists
    if review_input.product_id not in products_db:
        raise HTTPException(
            status_code=404,
            detail=f"Product with ID {review_input.product_id} not found"
        )
    
    # Perform ML sentiment analysis
    sentiment_result = analyze_sentiment_ml(review_input.review_text)
    
    processing_time = (datetime.now() - start_time).total_seconds() * 1000
    
    # Store the review for analytics
    review_data = {
        "product_id": review_input.product_id,
        "review_text": review_input.review_text,
        "user_name": review_input.user_name,
        "rating": review_input.rating,
        "sentiment": sentiment_result["sentiment"],
        "confidence": sentiment_result["confidence"],
        "timestamp": datetime.now().isoformat()
    }
    reviews_storage.append(review_data)
    
    response = SentimentResponse(
        sentiment=sentiment_result["sentiment"],
        confidence=sentiment_result["confidence"],
        label=sentiment_result["label"],
        product_id=review_input.product_id,
        review_text=review_input.review_text,
        user_name=review_input.user_name,
        timestamp=datetime.now().isoformat(),
        processing_time_ms=processing_time
    )
    
    return response

@app.get("/reviews", response_model=List[Dict[str, Any]])
async def get_reviews():
    """Get all processed reviews with sentiment analysis"""
    return reviews_storage

@app.get("/reviews/product/{product_id}", response_model=List[Dict[str, Any]])
async def get_reviews_by_product(product_id: int):
    """Get reviews for a specific product"""
    if product_id not in products_db:
        raise HTTPException(
            status_code=404,
            detail=f"Product with ID {product_id} not found"
        )
    
    product_reviews = [r for r in reviews_storage if r["product_id"] == product_id]
    return product_reviews

@app.get("/analytics/sentiment-summary")
async def get_sentiment_summary():
    """Get sentiment analysis summary for dashboard"""
    if not reviews_storage:
        return {
            "total_reviews": 0,
            "sentiment_distribution": {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0},
            "average_confidence": 0.0,
            "top_products": []
        }
    
    # Calculate sentiment distribution
    sentiment_counts = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}
    total_confidence = 0
    
    for review in reviews_storage:
        sentiment = review["sentiment"]
        sentiment_counts[sentiment] += 1
        total_confidence += review["confidence"]
    
    # Calculate product performance
    product_performance = {}
    for review in reviews_storage:
        product_id = review["product_id"]
        if product_id not in product_performance:
            product_performance[product_id] = {
                "name": products_db[product_id]["name"],
                "review_count": 0
            }
        product_performance[product_id]["review_count"] += 1
    
    # Sort products by review count
    top_products = sorted(
        product_performance.values(),
        key=lambda x: x["review_count"],
        reverse=True
    )[:5]
    
    return {
        "total_reviews": len(reviews_storage),
        "sentiment_distribution": sentiment_counts,
        "average_confidence": total_confidence / len(reviews_storage) if reviews_storage else 0.0,
        "top_products": top_products
    }

@app.get("/products", response_model=Dict[int, Dict[str, str]])
async def get_products():
    """Get all available products"""
    return products_db

@app.get("/products/{product_id}", response_model=Dict[str, str])
async def get_product(product_id: int):
    """Get a specific product by ID"""
    if product_id not in products_db:
        raise HTTPException(
            status_code=404,
            detail=f"Product with ID {product_id} not found"
        )
    return products_db[product_id]

@app.get("/analytics/sentiment-summary")
async def get_sentiment_summary():
    """Get sentiment analysis summary statistics"""
    if not reviews_storage:
        return {
            "total_reviews": 0,
            "sentiment_distribution": {},
            "average_confidence": 0.0,
            "top_products": []
        }
    
    sentiment_counts = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}
    total_confidence = 0.0
    
    for review in reviews_storage:
        sentiment_counts[review["sentiment"]] += 1
        total_confidence += review["confidence"]
    
    # Get top products by review count
    product_review_counts = {}
    for review in reviews_storage:
        product_id = review["product_id"]
        product_review_counts[product_id] = product_review_counts.get(product_id, 0) + 1
    
    top_products = sorted(
        product_review_counts.items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:5]
    
    return {
        "total_reviews": len(reviews_storage),
        "sentiment_distribution": sentiment_counts,
        "average_confidence": total_confidence / len(reviews_storage),
        "top_products": [
            {"product_id": pid, "review_count": count, "name": products_db[pid]["name"]}
            for pid, count in top_products
        ]
    }

def analyze_sentiment_ml(text: str) -> Dict[str, Any]:
    """
    Perform sentiment analysis using available ML models
    Priority: Transformers > TextBlob > Fallback keyword analysis
    """
    global sentiment_model, model_type
    
    # Method 1: HuggingFace Transformers (most accurate)
    if model_type == "transformers" and sentiment_model is not None:
        try:
            result = sentiment_model(text)[0]
            label = result['label'].upper()
            score = result['score']
            
            # Map transformer labels to our standard labels
            if label in ['POSITIVE', 'LABEL_2']:
                sentiment = "POSITIVE"
                label_text = "Great Choice!"
            elif label in ['NEGATIVE', 'LABEL_0']:
                sentiment = "NEGATIVE"
                label_text = "Avoid This Item"
            else:
                sentiment = "NEUTRAL"
                label_text = "Average Choice"
            
            return {
                "sentiment": sentiment,
                "confidence": round(score, 2),
                "label": label_text,
                "model_used": "transformers"
            }
        except Exception as e:
            print(f"Transformers inference failed: {e}")
    
    # Method 2: TextBlob (medium accuracy)
    if model_type == "textblob":
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            
            if polarity > 0.1:
                sentiment = "POSITIVE"
                label_text = "Great Choice!"
                confidence = min(0.9, 0.5 + abs(polarity))
            elif polarity < -0.1:
                sentiment = "NEGATIVE"
                label_text = "Avoid This Item"
                confidence = min(0.9, 0.5 + abs(polarity))
            else:
                sentiment = "NEUTRAL"
                label_text = "Average Choice"
                confidence = 0.5 + (1 - abs(polarity)) * 0.3
            
            return {
                "sentiment": sentiment,
                "confidence": round(confidence, 2),
                "label": label_text,
                "model_used": "textblob"
            }
        except Exception as e:
            print(f"TextBlob inference failed: {e}")
    
    # Method 3: Fallback keyword-based analysis
    return fallback_sentiment_analysis(text)

def fallback_sentiment_analysis(text: str) -> Dict[str, Any]:
    """
    Fallback sentiment analysis using keyword matching
    """
    # Fashion-specific positive keywords
    positive_keywords = [
        'love', 'amazing', 'excellent', 'perfect', 'beautiful', 'stunning',
        'great', 'fantastic', 'wonderful', 'awesome', 'brilliant', 'quality',
        'comfortable', 'fits', 'gorgeous', 'elegant', 'stylish', 'happy',
        'soft', 'smooth', 'flattering', 'versatile', 'classic', 'trendy',
        'luxurious', 'well-made', 'durable', 'exactly', 'better', 'nice'
    ]
    
    # Fashion-specific negative keywords
    negative_keywords = [
        'bad', 'terrible', 'awful', 'hate', 'disappointed', 'poor', 'cheap',
        'ugly', 'uncomfortable', 'doesn\'t fit', 'wrong', 'broken', 'return',
        'waste', 'regret', 'disaster', 'horrible', 'worst', 'scratchy',
        'tight', 'loose', 'flimsy', 'see-through', 'different', 'small',
        'large', 'defective', 'damaged', 'stains', 'rips'
    ]
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_keywords if word in text_lower)
    negative_count = sum(1 for word in negative_keywords if word in text_lower)
    
    # Calculate sentiment based on keyword counts
    if positive_count > negative_count:
        sentiment = "POSITIVE"
        confidence = min(0.85, 0.55 + (positive_count * 0.08))
        label = "Great Choice!"
    elif negative_count > positive_count:
        sentiment = "NEGATIVE"
        confidence = min(0.85, 0.55 + (negative_count * 0.08))
        label = "Avoid This Item"
    else:
        sentiment = "NEUTRAL"
        confidence = 0.5
        label = "Average Choice"
    
    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 2),
        "label": label,
        "model_used": "fallback"
    }

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": "HTTP Exception",
        "message": exc.detail,
        "status_code": exc.status_code,
        "timestamp": datetime.now().isoformat()
    }

@app.exception_handler(ValueError)
async def validation_exception_handler(request, exc):
    return {
        "error": "Validation Error",
        "message": str(exc),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
