// Models and validation for stay reviews
import { z } from 'zod';

export const stayReviewSchema = z.object({
  stay_id: z.string().describe('Duffel stay/hotel ID (e.g., acc_0000AWr2VsUNIF1Vl91xg0)'),
  after: z.string().optional().describe('Pagination cursor: after'),
  before: z.string().optional().describe('Pagination cursor: before'),
  limit: z.number().int().min(1).max(200).optional().describe('Max reviews to return (1-200)'),
});

export type StayReviewRequest = z.infer<typeof stayReviewSchema>;

export interface StayReview {
  text: string;
  score: number;
  reviewer_name: string;
  created_at: string;
}

export interface StayReviewResponse {
  meta: {
    limit: number;
    after?: string;
    before?: string;
  };
  reviews: StayReview[];
}
