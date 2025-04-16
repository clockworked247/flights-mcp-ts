// Models and validation for stay (hotel/accommodation) search
import { z } from 'zod';

export const staySearchSchema = z.object({
  location: z.string().describe('City, airport code, or area to search for stays'),
  check_in_date: z.string().describe('Check-in date (YYYY-MM-DD)'),
  check_out_date: z.string().describe('Check-out date (YYYY-MM-DD)'),
  guests: z.number().int().min(1).describe('Number of guests'),
  rooms: z.number().int().min(1).optional().describe('Number of rooms'),
  radius_km: z.number().optional().describe('Search radius in kilometers'),
});

export type StaySearch = z.infer<typeof staySearchSchema>;
