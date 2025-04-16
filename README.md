# Flight Search MCP (TypeScript)

A TypeScript implementation of a flight search MCP server that uses the Duffel API to search for flights. This MCP server provides tools to search for one-way, round-trip, and multi-city flights.

[![smithery badge](https://smithery.ai/badge/@clockworked247/flights-mcp-ts)](https://smithery.ai/server/@clockworked247/flights-mcp-ts)

## Features

- Search for one-way, round-trip, and multi-city flights
- Get detailed information about specific flight offers
- Specify cabin class, number of passengers, and connection preferences
- Filter by departure and arrival time windows

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

## Example Queries

- "Find flights from SFO to NYC on May 15, 2025"
- "Search for a round-trip flight from LAX to LHR departing June 10 and returning June 20"
- "Find business class flights from Tokyo to Paris for 2 adults"
- "Get details for flight offer [offer_id]"

## Local Development

For development with automatic reloading:
```bash
npm run dev
```

## License

MIT
