#!/usr/bin/env python3
"""
Set API Key - Script to set the DeepSeek API key in the environment.

This script sets the DeepSeek API key in the environment and tests the connection.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any

# Add the parent directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the LLM client
from bitebase_ai.core.llm_client import LLMClient

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Set API Key")
    parser.add_argument("--provider", type=str, choices=["deepseek", "openai"], default="deepseek", help="API provider")
    parser.add_argument("--key", type=str, required=True, help="API key")
    parser.add_argument("--test", action="store_true", help="Test the API key")
    
    return parser.parse_args()

def set_api_key(provider: str, key: str):
    """Set the API key in the environment."""
    if provider == "deepseek":
        os.environ["DEEPSEEK_API_KEY"] = key
        print(f"DeepSeek API key set in environment.")
    elif provider == "openai":
        os.environ["OPENAI_API_KEY"] = key
        print(f"OpenAI API key set in environment.")
    else:
        print(f"Unknown provider: {provider}")
        sys.exit(1)

def test_api_key(provider: str, key: str):
    """Test the API key."""
    print(f"Testing {provider} API key...")
    
    # Initialize the LLM client
    client = LLMClient({
        "provider": provider,
        "model": "deepseek-chat" if provider == "deepseek" else "gpt-3.5-turbo",
        "temperature": 0.0,
        "max_tokens": 100,
        "api_keys": {
            provider: key
        }
    })
    
    # Test the API key
    try:
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello!"}
        ]
        
        response = client.chat_completion(messages)
        text = client.extract_response_text(response)
        
        print(f"API response: {text}")
        print(f"✓ {provider.capitalize()} API key is valid!")
        
        return True
    except Exception as e:
        print(f"✗ Error testing {provider} API key: {str(e)}")
        return False

def main():
    """Run the script."""
    args = parse_args()
    
    # Set the API key
    set_api_key(args.provider, args.key)
    
    # Test the API key if requested
    if args.test:
        if not test_api_key(args.provider, args.key):
            sys.exit(1)
    
    print(f"✓ {args.provider.capitalize()} API key set successfully!")

if __name__ == "__main__":
    main()
