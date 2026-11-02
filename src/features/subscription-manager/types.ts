export type SubscriptionCategory =
  | 'entertainment'
  | 'work_software'
  | 'cloud_infrastructure'
  | 'utilities'
  | 'fitness'
  | 'education'
  | 'finance'
  | 'other';

export type BillingCycle =
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi-annually'
  | 'annually';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'trial';

export interface BillingHistoryItem {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  billingDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  name: string;
  category: SubscriptionCategory;
  price: number;
  currency: string; // e.g. "IDR", "USD"
  billingCycle: BillingCycle;
  startDate: string;
  nextRenewalDate: string;
  autoRenew: boolean;
  status: SubscriptionStatus;
  trialEndDate?: string;
  paymentMethod: string;
  paymentAccountId?: string;
  reminderDaysBefore: number;
  cancellationUrl?: string;
  notes?: string;
  websiteUrl?: string;
  createdAt: string;
}

export type SubscriptionViewMode =
  | 'all'
  | 'active'
  | 'renewals'
  | 'trials'
  | 'analytics'
  | 'history';
