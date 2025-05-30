#!/usr/bin/env python3
"""
Test DeepSeek API - Simple script to test the DeepSeek API connection.
"""

import os
import sys
import requests
import argparse

def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Test DeepSeek API")
    parser.add_argument("--key", type=str, required=True, help="DeepSeek API key")
    
    return parser.parse_args()

def test_deepseek_api(api_key):
    """Test the DeepSeek API."""
    print(f"Testing DeepSeek API...")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello!"}
        ],
        "temperature": 0.0,
        "max_tokens": 100
    }
    
    try:
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=60
        )
        
        response.raise_for_status()
        result = response.json()
        text = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        
        print(f"API response: {text}")
        print(f"✓ DeepSeek API key is valid!")
        
        # Set the API key in the environment
        os.environ["DEEPSEEK_API_KEY"] = api_key
        print(f"DeepSeek API key set in environment.")
        
        # Create or update .env file
        with open("../.env", "w") as f:
            f.write(f"DEEPSEEK_API_KEY={api_key}\n")
            f.write("LLM_PROVIDER=deepseek\n")
            f.write("LLM_MODEL=deepseek-chat\n")
        
        print(f"DeepSeek API key saved to .env file.")
        return True
    except Exception as e:
        print(f"✗ Error testing DeepSeek API key: {str(e)}")
        return False

def main():
    """Run the script."""
    args = parse_args()
    
    # Test the API key
    if not test_deepseek_api(args.key):
        sys.exit(1)
    
    print(f"✓ DeepSeek API key set successfully!")

if __name__ == "__main__":
    main()
