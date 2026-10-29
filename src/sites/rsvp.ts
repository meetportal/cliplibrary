import { z } from 'zod';

export const rsvpReplySchema = z.object({
  name: z.string().trim().min(1).max(80),
  attending: z.boolean(),
  guests: z.number().int().min(1).max(10),
  dietary: z.string().trim().max(300),
  message: z.string().trim().max(1000),
});

export type RsvpReply = z.infer<typeof rsvpReplySchema>;

export interface StoredRsvp extends RsvpReply {
  receivedAt: string;
}
