"""
Marketing Research Integration Tests
"""

import os
import pytest
import json
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

from main import app
from app.services.marketing_research import MarketingResearchAdapter

client = TestClient(app)

@pytest.fixture
def mock_marketing_research_adapter():
    """Mock marketing research adapter for testing"""
    with patch("app.services.marketing_research.MarketingResearchAdapter") as mock:
        mock_instance = mock.return_value
        mock_instance.process_marketing_request = AsyncMock()
        mock_instance.get_marketing_insight = AsyncMock()
        mock_instance.get_comprehensive_research = AsyncMock()
        mock_instance.analyze_competitive_landscape = AsyncMock()
        mock_instance.generate_marketing_campaign = AsyncMock()
        mock_instance.list_datasets = AsyncMock()
        yield mock_instance

def test_marketing_endpoint(mock_marketing_research_adapter):
    """Test the marketing research endpoint"""
    # Setup mock response
    mock_marketing_research_adapter.process_marketing_request.return_value = {
        "response": "Test marketing response",
        "sentiment": {"compound": 0.5, "pos": 0.7, "neu": 0.2, "neg": 0.1},
        "keywords": [["marketing", 10], ["test", 5]],
        "charts": {"Test Chart": "base64data"}
    }
    
    # Test request
    response = client.post(
        "/api/marketing-research",
        json={
            "message": "What are the best marketing strategies?",
            "user_id": "test-user",
            "session_id": "test-session"
        }
    )
    
    # Verify response
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "suggestions" in data
    assert "actions" in data
    
    # Check if marketing_research was called
    mock_marketing_research_adapter.process_marketing_request.assert_called_once()

@pytest.mark.asyncio
async def test_marketing_research_adapter():
    """Test the MarketingResearchAdapter class directly"""
    adapter = MarketingResearchAdapter(base_url="http://localhost:5001")
    
    # Mock the httpx client post method
    with patch("httpx.AsyncClient.post") as mock_post:
        # Setup mock response
        mock_post.return_value.status_code = 200
        mock_post.return_value.json = lambda: {
            "response": "Test response",
            "sentiment": {"compound": 0.5, "pos": 0.7, "neu": 0.2, "neg": 0.1},
            "keywords": [["marketing", 10], ["test", 5]],
            "charts": {"Test Chart": "base64data"}
        }
        
        # Test marketing insight
        result = await adapter.get_marketing_insight("test query")
        assert "response" in result
        assert "sentiment" in result
        assert "keywords" in result
        assert "charts" in result
        
        # Test comprehensive research
        result = await adapter.get_comprehensive_research("test query")
        assert "response" in result
        
        # Test competitive landscape analysis
        result = await adapter.analyze_competitive_landscape("test query")
        assert "response" in result
        
        # Test marketing campaign generation
        result = await adapter.generate_marketing_campaign("test query")
        assert "response" in result

@pytest.mark.asyncio
async def test_error_handling():
    """Test error handling in MarketingResearchAdapter"""
    adapter = MarketingResearchAdapter(base_url="http://localhost:5001")
    
    # Mock httpx client post to raise an exception
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.side_effect = Exception("Test error")
        
        # Test error handling in get_marketing_insight
        result = await adapter.get_marketing_insight("test query")
        assert "error" in result
        assert "Test error" in result["response"]
        
        # Test error handling in process_marketing_request
        result = await adapter.process_marketing_request({"query": "test query", "action": "insight"})
        assert "error" in result
        assert "Test error" in result["response"]

def test_marketing_action_handler():
    """Test handling of marketing actions"""
    # Test marketing_research action
    response = client.post(
        "/copilotkit/chat",
        json={
            "message": "analyze marketing strategies",
            "user_id": "test-user",
            "session_id": "test-session",
            "actions": ["marketing_research"]
        }
    )
    assert response.status_code == 200

    # Test competitive_analysis action
    response = client.post(
        "/copilotkit/chat",
        json={
            "message": "analyze competitors",
            "user_id": "test-user",
            "session_id": "test-session",
            "actions": ["competitive_analysis"]
        }
    )
    assert response.status_code == 200

    # Test marketing_campaign action
    response = client.post(
        "/copilotkit/chat",
        json={
            "message": "create marketing campaign",
            "user_id": "test-user",
            "session_id": "test-session",
            "actions": ["marketing_campaign"]
        }
    )
    assert response.status_code == 200
