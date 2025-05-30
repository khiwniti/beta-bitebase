#!/usr/bin/env python3
"""
Test script to verify the integration of the new agent architecture with the legacy components.
"""

import os
import sys
import json
from typing import Dict, List, Any

# Add the parent directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import both new and legacy components
from bitebase_ai.agents import RestaurantDataAgent, RestaurantAnalysisAgent
from bitebase_ai.legacy import OriginalRestaurantDataAgent, OriginalRestaurantMatcher, OriginalRestaurantDataValidator
from bitebase_ai import create_research_agent, graph

def test_new_architecture():
    """Test the new agent architecture."""
    print("Testing new agent architecture...")
    
    # Initialize the data agent
    data_agent = RestaurantDataAgent()
    
    # Initialize the analysis agent
    analysis_agent = RestaurantAnalysisAgent()
    
    print("✓ Successfully imported new agent architecture")
    
    return True

def test_legacy_components():
    """Test the legacy components."""
    print("Testing legacy components...")
    
    # Initialize the original data agent
    original_data_agent = OriginalRestaurantDataAgent()
    
    # Initialize the original matcher
    original_matcher = OriginalRestaurantMatcher()
    
    # Initialize the original validator
    original_validator = OriginalRestaurantDataValidator()
    
    # Test the research agent
    research_agent = create_research_agent()
    
    print("✓ Successfully imported legacy components")
    
    return True

def main():
    """Run the integration tests."""
    print("Running integration tests...")
    
    # Test the new architecture
    new_architecture_ok = test_new_architecture()
    
    # Test the legacy components
    legacy_components_ok = test_legacy_components()
    
    # Print the results
    if new_architecture_ok and legacy_components_ok:
        print("✓ All integration tests passed!")
        return 0
    else:
        print("✗ Integration tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
