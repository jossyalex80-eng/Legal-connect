export const PRACTICE_AREAS = [
  'Family Law',
  'Criminal Law',
  'Civil Law',
  'Property Law',
  'Land Dispute',
  'Corporate Law',
  'Employment Law',
  'Tax Law',
  'Immigration Law',
  'Human Rights Law',
  'Contract Law',
  'Real Estate Law',
  'Banking Law',
  'Insurance Law',
  'Intellectual Property',
  'Cybercrime Law',
] as const;

export const URGENCY_LEVELS = ['Normal', 'Urgent', 'Emergency'] as const;

export const BUDGET_RANGES = [
  '₦50k-₦100k',
  '₦100k-₦300k',
  '₦300k-₦500k',
  '₦500k+',
] as const;

export const CONSULTATION_METHODS = ['Phone', 'Video', 'Physical', 'Chat'] as const;

export const CASE_STATUSES = [
  'submitted',
  'analyzing',
  'recommended',
  'in_progress',
  'completed',
] as const;

export type PracticeArea = typeof PRACTICE_AREAS[number];
export type UrgencyLevel = typeof URGENCY_LEVELS[number];
export type BudgetRange = typeof BUDGET_RANGES[number];
export type ConsultationMethod = typeof CONSULTATION_METHODS[number];
export type CaseStatus = typeof CASE_STATUSES[number];
