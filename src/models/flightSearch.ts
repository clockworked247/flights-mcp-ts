/**
 * Flight search model definitions
 */
import { z } from 'zod';

export const timeSpecSchema = z.object({
  fromTime: z.string().describe('Start time in 24-hour format (HH:MM)'),
  toTime: z.string().describe('End time in 24-hour format (HH:MM)')
});

export type TimeSpec = z.infer<typeof timeSpecSchema>;

export const flightSegmentSchema = z.object({
  origin: z.string().describe('Origin airport or city IATA code (e.g., SFO, NYC)'),
  destination: z.string().describe('Destination airport or city IATA code (e.g., LAX, LHR)'),
  departureDate: z.string().describe('Departure date in YYYY-MM-DD format')
});

export type FlightSegment = z.infer<typeof flightSegmentSchema>;

export const flightSearchSchema = z.object({
  type: z.enum(['one_way', 'round_trip', 'multi_city']).describe('Type of flight'),
  origin: z.string().describe('Origin airport or city IATA code (e.g., SFO, NYC)'),
  destination: z.string().describe('Destination airport or city IATA code (e.g., LAX, LHR)'),
  departureDate: z.string().describe('Departure date in YYYY-MM-DD format'),
  returnDate: z.string().optional().describe('Return date in YYYY-MM-DD format (required for round-trip)'),
  departureTime: timeSpecSchema.optional().describe('Preferred departure time window'),
  arrivalTime: timeSpecSchema.optional().describe('Preferred arrival time window'),
  cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']).describe('Cabin class'),
  adults: z.number().min(1).default(1).describe('Number of adult passengers'),
  maxConnections: z.number().optional().describe('Maximum number of connections'),
  additionalStops: z.array(flightSegmentSchema).optional().describe('Additional stops for multi-city flights')
});

export type FlightSearch = z.infer<typeof flightSearchSchema>;

export const offerDetailsSchema = z.object({
  offerId: z.string().describe('Unique identifier for the flight offer')
});

export type OfferDetails = z.infer<typeof offerDetailsSchema>;

export const multiCityRequestSchema = z.object({
  segments: z.array(flightSegmentSchema).min(2).describe('Flight segments for multi-city trip'),
  cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']).describe('Cabin class'),
  adults: z.number().min(1).default(1).describe('Number of adult passengers'),
  maxConnections: z.number().optional().describe('Maximum number of connections')
});

export type MultiCityRequest = z.infer<typeof multiCityRequestSchema>;
