# Bitebase Agent-Strapi Integration

This document outlines the integration between the Bitebase agent system and Strapi backend.

## Overview

The integration enables Strapi to act as a gateway for the Bitebase agent system, providing:

1. REST API endpoints for agent functionality
2. Admin UI for monitoring agent health and activity
3. Activity logging for agent interactions
4. Seamless communication between Strapi and agent services

## Architecture

```
┌─────────────────┐          ┌──────────────────┐          ┌───────────────────┐
│                 │          │                  │          │                   │
│  Frontend App   │◄────────►│  Strapi Backend  │◄────────►│   Agent System    │
│                 │          │                  │          │                   │
└─────────────────┘          └──────────────────┘          └───────────────────┘
                                      │
                                      │
                                      ▼
                             ┌─────────────────┐
                             │                 │
                             │   Database      │
                             │                 │
                             └─────────────────┘
```

## Implementation

The integration is implemented as a Strapi plugin called `agent-integration`, which provides:

- **Controllers**: Handle API requests and communicate with agent services
- **Services**: Provide common functionality for agent interaction
- **Routes**: Define API endpoints for agent functionality
- **Content Types**: Define data models for agent activities
- **Admin UI**: Provide monitoring and management interface

## API Endpoints

The following API endpoints are available:

- `POST /api/agent-integration/research` - Forward research requests to agents
- `GET /api/agent-integration/restaurants` - Get restaurant data from agents
- `GET /api/agent-integration/analyze` - Get market analysis from agents
- `GET /api/agent-integration/geocode` - Geocode addresses using agents
- `GET /api/agent-integration/health` - Check agent system health

## Configuration

The integration is configured through environment variables:

- `AGENT_FASTAPI_URL` - URL for the FastAPI agent service
- `AGENT_GATEWAY_URL` - URL for the agent gateway service

These can be set in the `.env` file or in the hosting environment.

## Setup Instructions

1. Ensure the Strapi backend is running
2. Ensure the agent system is running
3. Configure the environment variables
4. Access the Strapi admin panel to monitor agent status

## Usage Examples

### Making a Research Request

```javascript
// Frontend code
async function researchRestaurant(query) {
  const response = await fetch('/api/agent-integration/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  return response.json();
}
```

### Getting Restaurant Data

```javascript
// Frontend code
async function getRestaurants(latitude, longitude, radius) {
  const response = await fetch(
    `/api/agent-integration/restaurants?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
  );
  
  return response.json();
}
```

## Troubleshooting

If you encounter issues with the integration:

1. Check the agent system health at `/api/agent-integration/health`
2. Verify environment variables are correctly set
3. Check the Strapi logs for error messages
4. Verify network connectivity between Strapi and agent services

## Future Improvements

- Add caching layer for agent responses
- Implement rate limiting for agent requests
- Add support for user-specific agent configurations
- Enhance monitoring and alerting capabilities 