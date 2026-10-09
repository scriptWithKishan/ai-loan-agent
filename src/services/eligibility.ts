export type PropertyType = 'residential' | 'commercial' | 'industrial' | 'agricultural' | 'other';
export type OwnershipType = 'sole' | 'joint';
export type OccupationType = 'salaried' | 'self_employed';
export type IncomeModeType = 'bank' | 'cash';

export interface EligibilityInput {
  propertyType?: PropertyType | string | null;
  ownership?: OwnershipType | string | null;
  originalDocuments?: boolean | null;
  loanAmountInr?: number | null;
  occupation?: OccupationType | string | null;
  incomeMode?: IncomeModeType | string | null;
  marketValueInr?: number | null;
  tenureYears?: number | null;
}

export interface EligibilityResult {
  status: 'eligible' | 'not_eligible' | 'in_progress';
  failedReason: string | null;
  failedStep: string | null;
  missingFields: string[];
}

export const MAX_LOAN_AMOUNT_INR = 75_00_000; // ₹75 Lakhs
export const ELIGIBLE_PROPERTY_TYPES = new Set<string>(['residential', 'commercial', 'industrial']);

/**
 * Deterministic rules evaluation for Loan Against Property (LAP).
 * Evaluates immediate failure if any hard rule is violated,
 * returns in_progress if still collecting, and eligible when all 7 criteria pass.
 */
export function evaluateEligibility(data: EligibilityInput): EligibilityResult {
  // Hard Rule 1: Property Type (Residential, Commercial, Industrial = PASS; Agricultural/Other = FAIL)
  if (data.propertyType) {
    const normalizedType = String(data.propertyType).toLowerCase().trim();
    if (!ELIGIBLE_PROPERTY_TYPES.has(normalizedType)) {
      return {
        status: 'not_eligible',
        failedReason: `Property type (${data.propertyType}) is not eligible for this loan scheme. We only accept residential, commercial, or industrial properties. Agricultural land is not accepted.`,
        failedStep: 'property_type',
        missingFields: [],
      };
    }
  }

  // Hard Rule 2: Original Property Documents
  if (data.originalDocuments === false) {
    return {
      status: 'not_eligible',
      failedReason: 'Original title deed documents are strictly required for physical verification. Photocopies or missing original papers cannot be accepted.',
      failedStep: 'original_documents',
      missingFields: [],
    };
  }

  // Hard Rule 3: Loan Amount (Max ₹75,00,000)
  if (typeof data.loanAmountInr === 'number' && !isNaN(data.loanAmountInr)) {
    if (data.loanAmountInr > MAX_LOAN_AMOUNT_INR) {
      return {
        status: 'not_eligible',
        failedReason: `Requested loan amount (₹${data.loanAmountInr.toLocaleString('en-IN')}) exceeds our maximum preliminary program limit of ₹75 lakhs.`,
        failedStep: 'loan_amount',
        missingFields: [],
      };
    }
  }

  // Hard Rule 4: Income Mode (Must be received via Bank account)
  if (data.incomeMode) {
    const normalizedIncomeMode = String(data.incomeMode).toLowerCase().trim();
    if (normalizedIncomeMode === 'cash') {
      return {
        status: 'not_eligible',
        failedReason: 'Income must be credited to a recognized bank account. Cash-based salary or cash business income does not meet loan eligibility criteria.',
        failedStep: 'income_mode',
        missingFields: [],
      };
    }
  }

  // Check which mandatory fields are still missing
  const missing: string[] = [];

  if (!data.propertyType) missing.push('property_type');
  if (!data.ownership) missing.push('ownership');
  if (data.originalDocuments === null || data.originalDocuments === undefined) missing.push('original_documents');
  if (data.loanAmountInr === null || data.loanAmountInr === undefined) missing.push('loan_amount');
  if (!data.occupation) missing.push('occupation');
  if (!data.incomeMode) missing.push('income_mode');
  if (data.marketValueInr === null || data.marketValueInr === undefined) missing.push('market_value');
  if (data.tenureYears === null || data.tenureYears === undefined) missing.push('tenure');

  if (missing.length > 0) {
    return {
      status: 'in_progress',
      failedReason: null,
      failedStep: null,
      missingFields: missing,
    };
  }

  // All 7 items collected and passed
  return {
    status: 'eligible',
    failedReason: null,
    failedStep: null,
    missingFields: [],
  };
}
