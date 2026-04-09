# AI Tele Caller — API Documentation

This directory provides the backend API details required to power the frontend interface.

## Base URL
`https://api.yourdomain.com/v1`

---

## 1. Dashboard Metrics & Activity

### GET `/dashboard/metrics`
Fetches the high-level statistics for the current user's dashboard.
* **Response `200 OK`**:
  ```json
  {
    "totalCallsToday": 1284,
    "totalCallsChange": "+12.4%",
    "conversionRate": 23.8,
    "conversionRateChange": "+3.1%",
    "avgCallDuration": "04:32",
    "avgCallDurationChange": "-0.8%",
    "demosBooked": 48,
    "demosBookedChange": "+7"
  }
  ```

### GET `/dashboard/activity`
Fetches the recent activity feed across all campaigns.
* **Response `200 OK`**:
  ```json
  {
    "activities": [
      {
        "id": "act_123",
        "contactName": "Jordan M.",
        "campaignName": "Q2 Enterprise",
        "outcome": "Demo",
        "duration": "6m 14s",
        "timeAgo": "2 min ago",
        "status": "success"
      }
    ]
  }
  ```

---

## 2. Campaigns

### GET `/campaigns`
Fetches the list of active campaigns and their progress.
* **Response `200 OK`**:
  ```json
  {
    "campaigns": [
      {
        "id": "camp_1",
        "name": "Q2 Enterprise Outreach",
        "callsMade": 482,
        "conversionRate": 26,
        "progressPercentage": 68
      }
    ]
  }
  ```

### POST `/campaigns`
Creates a new AI calling campaign.
* **Request Body**:
  ```json
  {
    "businessName": "Acme Corp",
    "productService": "Enterprise CRM",
    "valueProposition": "30-day free trial...",
    "objective": "Describe the goal...",
    "voiceId": "v-alex",
    "schedule": {
      "startDate": "2026-04-10",
      "timezone": "IST (UTC+5:30)",
      "dailyLimit": 500
    },
    "settings": {
      "dndFiltering": true,
      "aiAdaptiveScript": true
    }
  }
  ```
* **Response `201 Created`**: Returns the created campaign object.

### POST `/campaigns/{id}/contacts`
Uploads a list of contacts via CSV (Multipart Form Data).
* **Payload**: `file` (CSV/XLSX file)
* **Response `200 OK`**: `{"importedCount": 2000}`.

---

## 3. Analytics & Insights

### GET `/analytics?campaignId={id}`
Fetches deep insights and funnel data for call analytics.
* **Response `200 OK`**:
  ```json
  {
    "summary": {
      "callsMade": 3841,
      "avgDuration": "04:18",
      "positiveOutcomes": 1102,
      "demosBooked": 312
    },
    "funnel": {
      "totalDialed": 3841,
      "answeredPercentage": 68,
      "engagedPercentage": 39,
      "interestedPercentage": 24,
      "convertedPercentage": 29
    },
    "topScripts": [
      { "name": "Enterprise Value Prop v3", "successRate": 84 },
      { "name": "ROI First Opener", "successRate": 71 }
    ]
  }
  ```

### GET `/insights`
Fetches behavioral insights and customer feel summary globally or per campaign.
* **Response `200 OK`**:
  ```json
  {
    "overallSentiment": {
      "positive": 70,
      "neutral": 15,
      "negative": 15
    },
    "avgConversionProbability": 68,
    "commonReactions": [
      { "reaction": "Asked for Info", "percentage": 78 },
      { "reaction": "Agreed to Demo", "percentage": 45 },
      { "reaction": "Requested Callback", "percentage": 32 },
      { "reaction": "Not Interested", "percentage": 22 }
    ],
    "objections": [
      {
        "objection": "Too expensive / budget constraints",
        "percentageOfNegatives": 34
      }
    ]
  }
  ```

---

## 4. Live Calls & WebSocket

### GET `/calls/live`
Fetches currently active calls to populate the live call view.

### WebSocket `/ws/calls/{callId}`
Real-time two-way connection for a live call to receive transcripts, sentiment, and send manual overrides.

* **Server Event (`transcript_update`)**:
  ```json
  {
    "speaker": "AI",
    "text": "Absolutely. AI Tele Caller automates 90% of your cold calling...",
    "timestamp": "04:16"
  }
  ```

* **Server Event (`intel_update`)**:
  ```json
  {
    "sentiment": "Positive",
    "sentimentScore": 72,
    "confidenceScore": 88,
    "detectedIntent": ["High Interest", "CRM Question"],
    "conversionProbability": 76,
    "keywords": ["CRM", "Integration", "Demo"]
  }
  ```

* **Client Message (`override_ai`)**:
  ```json
  {
    "action": "override_ai",
    "text": "Mention Salesforce & HubSpot — likely their stack"
  }
  ```
