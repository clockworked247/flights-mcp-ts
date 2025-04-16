/**
 * Duffel Stays API Client
 */
import axios, { AxiosInstance } from 'axios';

export interface StaySearchParams {
  location: string; // e.g. city or airport code
  check_in_date: string; // YYYY-MM-DD
  check_out_date: string; // YYYY-MM-DD
  guests: number;
  rooms?: number;
  radius_km?: number;
  // Add more params as needed
}

export interface StayOffer {
  hotel_id: string;
  offer_id: string;
  hotel_name: string;
  address: string;
  price: {
    amount: string;
    currency: string;
  };
  room_type: string;
  cancellation_policy: string;
  // Add more fields as needed
}

export interface StayOfferResponse {
  offers: StayOffer[];
}

import { StayReviewRequest, StayReviewResponse } from '../models/stayReview.js';

export class DuffelStaysClient {
  private client: AxiosInstance;
  private baseUrl: string = 'https://api.duffel.com/stays';

  constructor() {
    const apiKey = process.env.DUFFEL_API_KEY;
    if (!apiKey) {
      throw new Error('DUFFEL_API_KEY environment variable is not set');
    }
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Accept': 'application/json',
        'Duffel-Version': 'v1',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });
  }

  /**
   * Search for hotel/accommodation offers
   */
  async searchOffers(params: StaySearchParams): Promise<StayOfferResponse> {
    // Duffel API docs: https://duffel.com/docs/api/v2/offers
    const response = await this.client.post('/offers', {
      location: params.location,
      check_in_date: params.check_in_date,
      check_out_date: params.check_out_date,
      guests: params.guests,
      rooms: params.rooms,
      radius_km: params.radius_km,
    });
    // Adapt to Duffel's real response structure
    const offers = (response.data.data || []).map((offer: any) => ({
      offer_id: offer.id,
      hotel_id: offer.hotel?.id || '',
      hotel_name: offer.hotel?.name || '',
      address: offer.hotel?.address?.line_1 || '',
      price: offer.total_amount ? { amount: offer.total_amount, currency: offer.currency } : { amount: '', currency: '' },
      room_type: offer.room_type || '',
      cancellation_policy: offer.cancellation_policy || '',
    }));
    return { offers };
  }

  /**
   * Fetch stay reviews
   */
  async getStayReviews(params: StayReviewRequest): Promise<StayReviewResponse> {
    const { stay_id, after, before, limit } = params;
    const query: Record<string, string | number> = {};
    if (after) query.after = after;
    if (before) query.before = before;
    if (limit) query.limit = limit;
    const response = await this.client.get(`/accommodation/${stay_id}/reviews`, { params: query, headers: { 'Duffel-Version': 'v2' } });
    const meta = response.data.meta || {};
    const reviews = (response.data.data?.reviews || []).map((r: any) => ({
      text: r.text,
      score: r.score,
      reviewer_name: r.reviewer_name,
      created_at: r.created_at,
    }));
    return { meta, reviews };
  }
}
