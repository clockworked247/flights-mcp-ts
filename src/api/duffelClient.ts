/**
 * Duffel API Client
 */
import axios, { AxiosInstance } from 'axios';
import { TimeSpec } from '../models/flightSearch.js';

// Define interfaces for our API requests and responses
export interface Slice {
  origin: string;
  destination: string;
  departure_date: string;
  departure_time?: {
    from: string;
    to: string;
  };
  arrival_time?: {
    from: string;
    to: string;
  };
}

export interface OfferRequestParams {
  slices: Slice[];
  cabin_class: string;
  adult_count: number;
  max_connections?: number;
  return_offers: boolean;
  supplier_timeout: number;
}

export interface Connection {
  airport: string;
  arrival: string;
  departure: string;
  duration: string;
}

export interface SliceDetails {
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  carrier: string;
  stops: number;
  stops_description: string;
  connections: Connection[];
}

export interface FormattedOffer {
  offer_id: string;
  price: {
    amount: string;
    currency: string;
  };
  slices: SliceDetails[];
}

export interface FormattedOfferResponse {
  request_id: string;
  offers: FormattedOffer[];
}

export class DuffelClient {
  private client: AxiosInstance;
  private baseUrl: string = 'https://api.duffel.com/air';
  
  constructor() {
    const apiKey = process.env.DUFFEL_API_KEY;
    if (!apiKey) {
      throw new Error('DUFFEL_API_KEY environment variable is not set');
    }
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'Duffel-Version': 'v1',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 seconds
    });
    
    console.log(`API key starts with: ${apiKey.substring(0, 8)}...`);
    console.log(`Using base URL: ${this.baseUrl}`);
  }
  
  /**
   * Create a flight offer request
   */
  async createOfferRequest(params: OfferRequestParams): Promise<FormattedOfferResponse> {
    try {
      // Prepare the passengers array
      const passengers = Array(params.adult_count).fill({ type: 'adult' });
      
      // Create the request data
      const requestData = {
        data: {
          slices: params.slices,
          passengers,
          cabin_class: params.cabin_class
        }
      };

      if (params.max_connections !== undefined) {
        (requestData.data as any).max_connections = params.max_connections;
      }

      // Build query parameters
      const queryParams = {
        'return_offers': params.return_offers.toString(),
        'supplier_timeout': params.supplier_timeout.toString()
      };

      // Make the API call
      console.log(`Creating offer request with data: ${JSON.stringify(requestData)}`);
      
      const response = await this.client.post('/offer_requests', requestData, { 
        params: queryParams 
      });
      
      const responseData = response.data;
      
      const requestId = responseData.data.id;
      const offers = responseData.data.offers || [];
      
      console.log(`Created offer request with ID: ${requestId}`);
      console.log(`Received ${offers.length} offers`);
      
      // Format the response
      const formattedResponse: FormattedOfferResponse = {
        request_id: requestId,
        offers: []
      };
      
      // Process offers (limit to 50 to manage response size)
      formattedResponse.offers = offers.slice(0, 50).map((offer: any) => {
        const formattedOffer: FormattedOffer = {
          offer_id: offer.id,
          price: {
            amount: offer.total_amount,
            currency: offer.total_currency,
          },
          slices: []
        };
        
        // Process slices
        if (offer.slices) {
          formattedOffer.slices = offer.slices.map((slice: any) => {
            const segments = slice.segments || [];
            
            if (segments.length === 0) {
              return {
                origin: slice.origin.iata_code,
                destination: slice.destination.iata_code,
                departure: '',
                arrival: '',
                duration: slice.duration || '',
                carrier: '',
                stops: 0,
                stops_description: 'No segments available',
                connections: []
              };
            }
            
            const sliceDetails: SliceDetails = {
              origin: slice.origin.iata_code,
              destination: slice.destination.iata_code,
              departure: segments[0].departing_at || '',
              arrival: segments[segments.length - 1].arriving_at || '',
              duration: slice.duration || '',
              carrier: segments[0].marketing_carrier?.name || '',
              stops: segments.length - 1,
              stops_description: segments.length === 1 ? 'Non-stop' : `${segments.length - 1} stop${segments.length - 1 > 1 ? 's' : ''}`,
              connections: []
            };
            
            // Add connection information
            if (segments.length > 1) {
              for (let i = 0; i < segments.length - 1; i++) {
                sliceDetails.connections.push({
                  airport: segments[i].destination?.iata_code || '',
                  arrival: segments[i].arriving_at || '',
                  departure: segments[i + 1].departing_at || '',
                  duration: segments[i + 1].duration || ''
                });
              }
            }
            
            return sliceDetails;
          });
        }
        
        return formattedOffer;
      });
      
      return formattedResponse;
      
    } catch (error) {
      console.error(`Error creating offer request: ${error}`);
      throw error;
    }
  }
  
  /**
   * Get details of a specific offer
   */
  async getOffer(offerId: string): Promise<any> {
    try {
      if (!offerId.startsWith('off_')) {
        throw new Error('Invalid offer ID format - must start with "off_"');
      }
      
      const response = await this.client.get(`/offers/${offerId}`);
      return response.data;
      
    } catch (error) {
      console.error(`Error getting offer ${offerId}: ${error}`);
      throw error;
    }
  }
  
  /**
   * Helper to create a slice with time ranges
   */
  createSlice(
    origin: string, 
    destination: string, 
    date: string,
    departureTime?: TimeSpec,
    arrivalTime?: TimeSpec
  ): Slice {
    const slice: Slice = {
      origin,
      destination,
      departure_date: date,
      departure_time: {
        from: '00:00',
        to: '23:59'
      },
      arrival_time: {
        from: '00:00',
        to: '23:59'
      }
    };
    
    if (departureTime) {
      slice.departure_time = {
        from: departureTime.fromTime,
        to: departureTime.toTime
      };
    }
    
    if (arrivalTime) {
      slice.arrival_time = {
        from: arrivalTime.fromTime,
        to: arrivalTime.toTime
      };
    }
    
    return slice;
  }
}
