"""
Restaurant API endpoints
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
import structlog

from app.core.auth import get_current_user
from app.models.user import User

logger = structlog.get_logger()
router = APIRouter()


class Restaurant(BaseModel):
    """Restaurant model"""
    id: str
    name: str
    cuisine_type: str
    address: str
    latitude: float
    longitude: float
    rating: Optional[float] = None
    price_range: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


class RestaurantSearch(BaseModel):
    """Restaurant search parameters"""
    location: Optional[str] = None
    cuisine_type: Optional[str] = None
    radius: Optional[float] = 5.0  # km
    min_rating: Optional[float] = None
    price_range: Optional[str] = None


@router.get("/", response_model=List[Restaurant])
async def get_restaurants(
    location: Optional[str] = Query(None),
    cuisine_type: Optional[str] = Query(None),
    radius: Optional[float] = Query(5.0),
    limit: int = Query(50, le=100),
    current_user: User = Depends(get_current_user)
) -> List[Restaurant]:
    """
    Get restaurants based on search criteria
    """
    try:
        # Mock restaurant data for demonstration
        mock_restaurants = [
            Restaurant(
                id="rest_001",
                name="Bangkok Street Food",
                cuisine_type="Thai",
                address="123 Sukhumvit Road, Bangkok",
                latitude=13.7563,
                longitude=100.5018,
                rating=4.5,
                price_range="$$",
                phone="+66-2-123-4567"
            ),
            Restaurant(
                id="rest_002",
                name="Sushi Zen",
                cuisine_type="Japanese",
                address="456 Silom Road, Bangkok",
                latitude=13.7244,
                longitude=100.5343,
                rating=4.8,
                price_range="$$$",
                phone="+66-2-234-5678"
            ),
            Restaurant(
                id="rest_003",
                name="Pizza Corner",
                cuisine_type="Italian",
                address="789 Khao San Road, Bangkok",
                latitude=13.7590,
                longitude=100.4983,
                rating=4.2,
                price_range="$$",
                phone="+66-2-345-6789"
            )
        ]
        
        # Filter by cuisine type if provided
        if cuisine_type:
            mock_restaurants = [
                r for r in mock_restaurants 
                if r.cuisine_type.lower() == cuisine_type.lower()
            ]
        
        # Limit results
        return mock_restaurants[:limit]
        
    except Exception as e:
        logger.error("Error fetching restaurants", exc_info=e)
        raise HTTPException(status_code=500, detail="Failed to fetch restaurants")


@router.get("/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(
    restaurant_id: str,
    current_user: User = Depends(get_current_user)
) -> Restaurant:
    """
    Get restaurant by ID
    """
    try:
        # Mock restaurant data
        if restaurant_id == "rest_001":
            return Restaurant(
                id="rest_001",
                name="Bangkok Street Food",
                cuisine_type="Thai",
                address="123 Sukhumvit Road, Bangkok",
                latitude=13.7563,
                longitude=100.5018,
                rating=4.5,
                price_range="$$",
                phone="+66-2-123-4567",
                website="https://bangkokstreetfood.com"
            )
        else:
            raise HTTPException(status_code=404, detail="Restaurant not found")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error fetching restaurant", exc_info=e)
        raise HTTPException(status_code=500, detail="Failed to fetch restaurant")


@router.post("/search", response_model=List[Restaurant])
async def search_restaurants(
    search_params: RestaurantSearch,
    current_user: User = Depends(get_current_user)
) -> List[Restaurant]:
    """
    Search restaurants with advanced parameters
    """
    try:
        # This would integrate with MCP Gateway for real search
        logger.info(
            "Restaurant search requested",
            user_id=current_user.id,
            params=search_params.dict()
        )
        
        # Mock search results
        return [
            Restaurant(
                id="rest_search_001",
                name="Local Thai Kitchen",
                cuisine_type="Thai",
                address="321 Local Street, Bangkok",
                latitude=13.7563,
                longitude=100.5018,
                rating=4.3,
                price_range="$"
            )
        ]
        
    except Exception as e:
        logger.error("Restaurant search failed", exc_info=e)
        raise HTTPException(status_code=500, detail="Search failed")


@router.get("/{restaurant_id}/analysis")
async def analyze_restaurant(
    restaurant_id: str,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get detailed analysis for a restaurant
    """
    try:
        # Mock analysis data
        return {
            "restaurant_id": restaurant_id,
            "competition_score": 7.5,
            "market_opportunity": 8.2,
            "foot_traffic": {
                "daily_average": 1250,
                "peak_hours": ["12:00-14:00", "19:00-21:00"]
            },
            "demographics": {
                "primary_age_group": "25-35",
                "income_level": "middle-upper",
                "lifestyle": "urban_professional"
            },
            "recommendations": [
                "Consider extending lunch hours",
                "Add delivery options",
                "Focus on social media marketing"
            ]
        }
        
    except Exception as e:
        logger.error("Restaurant analysis failed", exc_info=e)
        raise HTTPException(status_code=500, detail="Analysis failed")
