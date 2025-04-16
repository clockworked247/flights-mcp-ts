# Flight + Stay Search MCP (TypeScript)

A TypeScript implementation of a flight & Stay search MCP server that uses the Duffel API to search for flights. This MCP server provides tools to search for one-way, round-trip, and multi-city flights.

[![smithery badge](https://smithery.ai/badge/@clockworked247/flights-mcp-ts)](https://smithery.ai/server/@clockworked247/flights-mcp-ts)

## Features

- Search for one-way, round-trip, and multi-city flights
- Get detailed information about specific flight offers
- Specify cabin class, number of passengers, and connection preferences
- Filter by departure and arrival time windows
- Search for travel stays (hotels/accommodations)
- Get guest reviews for a specific stay/hotel

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file with:
```
DUFFEL_API_KEY=your_duffel_api_key
```

You can start with a test API key (`duffel_test`) to try the functionality.

## Using with Smithery

To publish this MCP to Smithery:
```bash
npx @smithery/cli publish
```

To run the published MCP:
```bash
npx @smithery/cli run @your-username/flights-mcp-ts --config "{\"duffelApiKey\":\"your_duffel_api_key\"}"
```

## Available Tools

This MCP provides the following tools:

1. `search_flights` - Search for one-way, round-trip, or multi-city flights
2. `get_offer_details` - Get detailed information about a specific flight offer
3. `search_multi_city` - A specialized tool for multi-city flight searches
4. `search_stays` - Search for travel stays (hotels/accommodations)
5. `get_stay_reviews` - Get guest reviews for a specific stay/hotel

## Example Queries

- "Find flights from SFO to NYC on May 15, 2025"
- "Search for a round-trip flight from LAX to LHR departing June 10 and returning June 20"
- "Find business class flights from Tokyo to Paris for 2 adults"
- "Get details for flight offer [offer_id]"
- "Find hotels in London for 2 guests from 2025-06-10 to 2025-06-12"
- "Get reviews for stay [hotel_id]"

---

## Stays/Hotel Search and Reviews

### 1. Search for Stays (`search_stays`)

**Parameters:**
- `location` (string): City, airport code, or area to search for stays
- `check_in_date` (string): Check-in date (YYYY-MM-DD)
- `check_out_date` (string): Check-out date (YYYY-MM-DD)
- `guests` (number): Number of guests
- `rooms` (number, optional): Number of rooms
- `radius_km` (number, optional): Search radius in kilometers

**Example Request:**
```json
{
  "location": "London",
  "check_in_date": "2025-06-10",
  "check_out_date": "2025-06-12",
  "guests": 2
}
```

**Example Response:**
```json
{
  "offers": [
    {
      "offer_id": "off_123",
      "hotel_id": "acc_0000AWr2VsUNIF1Vl91xg0",
      "hotel_name": "The Grand Hotel",
      "address": "1 Main St, London",
      "price": { "amount": "350.00", "currency": "GBP" },
      "room_type": "Deluxe Suite",
      "cancellation_policy": "Free cancellation until 24h before check-in"
    }
  ]
}
```

**Note:** Use the `hotel_id` from the search results as the `stay_id` for reviews.

---

### 2. Get Stay Reviews (`get_stay_reviews`)

**Parameters:**
- `stay_id` (string): The unique Duffel stay/hotel ID (from the search_stays result)
- `after` (string, optional): Pagination cursor (after)
- `before` (string, optional): Pagination cursor (before)
- `limit` (number, optional): Max reviews to return (1-200)

**Example Request:**
```json
{
  "stay_id": "acc_0000AWr2VsUNIF1Vl91xg0"
}
```

**Example Response:**
```json
{
  "meta": { "limit": 50, "after": "..." },
  "reviews": [
    {
      "text": "Excellent facilities. Polite staff.\nAir conditioning could use some maintenance.\n",
      "score": 8.4,
      "reviewer_name": "Bessie Coleman",
      "created_at": "2025-01-01"
    }
  ]
}
```

## Local Development

For development with automatic reloading:
```bash
npm run dev
```

## License

MIT
