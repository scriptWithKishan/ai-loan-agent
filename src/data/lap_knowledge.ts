export interface KnowledgeDoc {
  id: string
  topic: string
  category: 'product_overview' | 'eligibility' | 'documents' | 'repayment' | 'objections'
  content: string
}

export const LAP_KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: 'lap-overview',
    topic: 'Loan Against Property (LAP) Product Overview',
    category: 'product_overview',
    content: 'Our Loan Against Property program offers secured financing of up to ₹75,00,000 (seventy-five lakh rupees) against self-owned residential, commercial, or industrial properties. This call is a preliminary qualification check to assess basic criteria before a physical valuation and formal application.',
  },
  {
    id: 'lap-eligible-properties',
    topic: 'Eligible Property Types',
    category: 'eligibility',
    content: 'Eligible properties include residential properties (apartments, flats, independent houses, villas), commercial properties (retail shops, commercial office spaces), and industrial units (factories, godowns, warehouses with approved plans). Agricultural land, open farmland, gram panchayat unapproved plots, and properties under litigation are strictly NOT eligible.',
  },
  {
    id: 'lap-original-documents',
    topic: 'Original Title Documents Requirement',
    category: 'documents',
    content: 'Borrowers must possess original registered title deeds (Registered Sale Deed, Gift Deed, Conveyance Deed, or Mother Deed) free of encumbrances. Photocopies or certified copies without clear possession of the original papers are not acceptable because the lender requires physical custody of original deeds upon sanction.',
  },
  {
    id: 'lap-income-criteria',
    topic: 'Income Mode & Banking Requirements',
    category: 'eligibility',
    content: 'Both salaried professionals and self-employed individuals are welcome. However, income must strictly reflect in a recognized bank account (via bank salary transfers, NEFT, RTGS, or verifiable business account turnovers). Cash-in-hand salary or unbanked cash receipts cannot be considered for loan approval.',
  },
  {
    id: 'lap-interest-rates',
    topic: 'Interest Rates and Loan Charges',
    category: 'repayment',
    content: 'Indicative interest rates for Loan Against Property generally start from 9.25% to 11.5% per annum, depending on the property valuation, borrower credit profile, and tenure. The AI agent must never quote fixed interest rates or loan sanction guarantees; state that a dedicated loan specialist will provide the exact customized rate quote upon document verification.',
  },
  {
    id: 'lap-tenure-repayment',
    topic: 'Repayment Tenure & Loan-to-Value (LTV)',
    category: 'repayment',
    content: 'Repayment tenure can extend up to 15 years (180 months), with flexibility based on property age and retirement age. Loan-to-value (LTV) can be up to 60-70% of the independent market valuation of the property. Preliminary eligibility collects the requested tenure and valuation without hard limits.',
  },
  {
    id: 'lap-joint-ownership',
    topic: 'Joint Property Ownership Guidelines',
    category: 'eligibility',
    content: 'Properties owned jointly by family members (spouse, parents, siblings) are fully eligible. All co-owners on the title deed must join the loan as co-applicants. Sole ownership is equally eligible.',
  },
  {
    id: 'lap-disbursement-timeline',
    topic: 'Processing Timeline and Steps',
    category: 'product_overview',
    content: 'After preliminary phone qualification, the loan process typically takes 5 to 7 working days, which includes document collection, legal title search, physical property valuation by an empanelled valuer, and final sanction.',
  },
]
