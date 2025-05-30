# Marketing Research Integration

This document explains how to use the new marketing research components integrated with CopilotKit.

## Overview

The BiteBase marketing research agent has been integrated with CopilotKit to provide specialized insights for restaurant and cafe businesses. This integration enables:

1. Detection of marketing-related queries
2. Visualization of marketing research data
3. Sentiment analysis of customer feedback
4. Keyword analysis for trending topics
5. Quick access to marketing actions

## Components

The integration includes the following components:

### Backend Components

- `MarketingResearchAdapter`: Interfaces between CopilotKit and the marketing research agent
- Enhanced `CopilotService`: Detects and processes marketing-related queries
- API endpoints for marketing research actions

### Frontend Components

- `MarketingResearchVisualizer`: Displays charts and visualizations
- `SentimentAnalysis`: Shows sentiment analysis data
- `KeywordCloud`: Visualizes keyword frequency
- `MarketingResearchActions`: Provides quick access to marketing actions
- `EnhancedUnifiedAIChat`: An enhanced chat component with marketing research support

## Using the Components

### EnhancedUnifiedAIChat

The `EnhancedUnifiedAIChat` component is a drop-in replacement for `UnifiedAIChat` that adds marketing research visualization support:

```tsx
import { EnhancedUnifiedAIChat } from '@/components/ai';

// In your component:
<EnhancedUnifiedAIChat
  title="Marketing Assistant"
  placeholder="Ask about marketing strategies..."
/>
```

### MarketingResearchVisualizer

For custom UIs, you can use the `MarketingResearchVisualizer` component directly:

```tsx
import { MarketingResearchVisualizer } from '@/components/marketing-research';

// In your component:
<MarketingResearchVisualizer
  charts={charts}
  sentiment={sentiment}
  keywords={keywords}
/>
```

### Marketing Actions

To trigger marketing research actions:

```tsx
import { MarketingResearchActions } from '@/components/marketing-research';

// In your component:
<MarketingResearchActions
  onRequestAction={(action, parameters) => {
    // Call backend API with action and parameters
    fetchMarketingResearch(action, parameters);
  }}
  query="customer retention strategies"
/>
```

## API Endpoints

The following API endpoints are available:

- `POST /api/marketing-research`: General endpoint for marketing research requests
- `POST /copilotkit/action`: Action endpoint with support for:
  - `marketing_research`: Comprehensive research reports
  - `competitive_analysis`: Competitive landscape analysis
  - `marketing_campaign`: Marketing campaign generation

## Data Format

Marketing research responses include:

```typescript
{
  response: string;      // Text response
  charts: {             // Base64-encoded chart images
    [title: string]: string;
  };
  sentiment: {          // Sentiment analysis
    compound: number;   // Overall score (-1 to 1)
    pos: number;        // Positive percentage (0-1)
    neu: number;        // Neutral percentage (0-1)
    neg: number;        // Negative percentage (0-1)
  };
  keywords: [           // Top keywords with frequency
    [string, number][]  // [keyword, frequency]
  ];
}
```

## Styling

Custom CSS for marketing visualizations is available in `marketing-research.css`. Import this file to apply the default styling:

```tsx
import '@/components/marketing-research/marketing-research.css';
```

## Example Usage

```tsx
import { EnhancedUnifiedAIChat } from '@/components/ai';

export default function MarketingPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketing Research Assistant</h1>
      <EnhancedUnifiedAIChat
        title="Marketing Assistant"
        placeholder="Ask about marketing strategies, customer insights, or competitive analysis..."
      />
    </div>
  );
}
```
