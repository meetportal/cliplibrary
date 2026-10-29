export const isApprovedMetadata = (metadata: unknown): boolean =>
  typeof metadata === 'object' &&
  metadata !== null &&
  'approved' in metadata &&
  metadata.approved === true;

export const PENDING_MESSAGE =
  'Your account is waiting for approval. You can keep exploring, and these features unlock once an admin approves you.';
