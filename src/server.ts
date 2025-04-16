/**
 * Flight search MCP server implementation
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { 
  flightSearchSchema, 
  offerDetailsSchema, 
  multiCityRequestSchema, 
  FlightSearch, 
  OfferDetails, 
  MultiCityRequest 
} from './models/flightSearch.js';
import { DuffelClient } from './api/duffelClient.js';

// Create MCP server
export const createServer = () => {
  const server = new McpServer({ 
    name: 'flight-search-mcp', 
    version: '1.0.0' 
  });

  // Initialize Duffel client
  const flightClient = new DuffelClient();

  // Search for flights
  server.tool(
    'search_flights',
    flightSearchSchema.shape,
    async (params: FlightSearch) => {
      try {
        const slices = [];
        
        // Build slices based on flight type
        if (params.type === 'one_way') {
          slices.push(flightClient.createSlice(
            params.origin, 
            params.destination, 
            params.departureDate,
            params.departureTime,
            params.arrivalTime
          ));
        } else if (params.type === 'round_trip') {
          if (!params.returnDate) {
            throw new Error('Return date required for round-trip flights');
          }
          
          slices.push(flightClient.createSlice(
            params.origin,
            params.destination,
            params.departureDate,
            params.departureTime,
            params.arrivalTime
          ));
          
          slices.push(flightClient.createSlice(
            params.destination,
            params.origin,
            params.returnDate,
            params.departureTime,
            params.arrivalTime
          ));
        } else if (params.type === 'multi_city') {
          if (!params.additionalStops || params.additionalStops.length === 0) {
            throw new Error('Additional stops required for multi-city flights');
          }
          
          // First leg
          slices.push(flightClient.createSlice(
            params.origin,
            params.destination,
            params.departureDate
          ));
          
          // Additional legs
          for (const stop of params.additionalStops) {
            slices.push(flightClient.createSlice(
              stop.origin,
              stop.destination,
              stop.departureDate
            ));
          }
        }
        
        // Create the offer request
        const response = await flightClient.createOfferRequest({
          slices,
          cabin_class: params.cabinClass,
          adult_count: params.adults,
          max_connections: params.maxConnections,
          return_offers: true,
          supplier_timeout: 15000 // 15 seconds
        });
        
        // Return formatted response
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2)
            }
          ]
        };
        
      } catch (error) {
        console.error(`Error searching flights: ${error}`);
        throw error;
      }
    }
  );

  // Get offer details
  server.tool(
    'get_offer_details',
    offerDetailsSchema.shape,
    async (params: OfferDetails) => {
      try {
        const response = await flightClient.getOffer(params.offerId);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2)
            }
          ]
        };
        
      } catch (error) {
        console.error(`Error getting offer details: ${error}`);
        throw error;
      }
    }
  );

  // Multi-city search
  server.tool(
    'search_multi_city',
    multiCityRequestSchema.shape,
    async (params: MultiCityRequest) => {
      try {
        const slices = [];
        
        // Build slices from segments
        for (const segment of params.segments) {
          slices.push(flightClient.createSlice(
            segment.origin,
            segment.destination,
            segment.departureDate
          ));
        }
        
        // Create the offer request with a longer timeout for multi-city
        const response = await flightClient.createOfferRequest({
          slices,
          cabin_class: params.cabinClass,
          adult_count: params.adults,
          max_connections: params.maxConnections,
          return_offers: true,
          supplier_timeout: 30000 // 30 seconds
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2)
            }
          ]
        };
        
      } catch (error) {
        console.error(`Error searching multi-city flights: ${error}`);
        throw error;
      }
    }
  );

  return server;
};
