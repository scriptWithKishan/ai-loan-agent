import { createFileRoute } from '@tanstack/react-router'
import { evaluateEligibility, EligibilityInput } from '../../../services/eligibility'
import {
  normalizeAmountInr,
  normalizeTenureYears,
  normalizePropertyType,
  normalizeOwnership,
  normalizeIncomeMode,
} from '../../../services/normalizers'
import { db } from '../../../db'
import { calls } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export const Route = createFileRoute('/api/tools/check-eligibility')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const args = body?.args || body || {}

          const callId = args.call_id || args.callId
          const propertyType = normalizePropertyType(args.property_type)
          const ownership = normalizeOwnership(args.ownership)
          const originalDocuments = typeof args.original_documents === 'boolean' ? args.original_documents : null
          const loanAmountInr = normalizeAmountInr(args.loan_amount_inr)
          const occupation = args.occupation ? String(args.occupation).toLowerCase().trim() : null
          const incomeMode = normalizeIncomeMode(args.income_mode)
          const marketValueInr = normalizeAmountInr(args.market_value_inr)
          const tenureYears = normalizeTenureYears(args.tenure_years)

          const input: EligibilityInput = {
            propertyType,
            ownership,
            originalDocuments,
            loanAmountInr,
            occupation,
            incomeMode,
            marketValueInr,
            tenureYears,
          }

          const evaluation = evaluateEligibility(input)

          let nextInstruction = ''
          if (evaluation.status === 'not_eligible') {
            nextInstruction = `DISQUALIFIED: Inform customer warmly and respectfully that they do not meet preliminary eligibility due to: "${evaluation.failedReason}". Thank them for their time and end the call.`
          } else if (evaluation.status === 'eligible') {
            nextInstruction = 'ALL 7 CRITERIA PASSED: Congratulate the customer warmly, summarize the details noted, state that a loan specialist will follow up shortly to verify documents and provide exact rate quotes, ask if they have questions, and conclude warmly.'
          } else {
            nextInstruction = `IN PROGRESS: Criteria verified so far are valid. Please proceed to ask the next missing checklist items: ${evaluation.missingFields.join(', ')}.`
          }

          if (callId && process.env.DATABASE_URL) {
            try {
              await db
                .update(calls)
                .set({
                  eligibilityStatus: evaluation.status,
                  disqualificationReason: evaluation.failedReason,
                  disqualificationStep: evaluation.failedStep,
                  propertyType: propertyType || undefined,
                  ownership: ownership || undefined,
                  originalDocuments: originalDocuments ?? undefined,
                  loanAmountInr: loanAmountInr ?? undefined,
                  occupation: occupation || undefined,
                  incomeMode: incomeMode || undefined,
                  marketValueInr: marketValueInr ?? undefined,
                  tenureYears: tenureYears ?? undefined,
                  updatedAt: new Date(),
                })
                .where(eq(calls.id, callId))
            } catch (dbErr) {
              console.warn('DB update during eligibility check error:', dbErr)
            }
          }

          return new Response(
            JSON.stringify({
              result: {
                status: evaluation.status,
                failed_reason: evaluation.failedReason,
                failed_step: evaluation.failedStep,
                missing_fields: evaluation.missingFields,
                next_instruction: nextInstruction,
              },
            }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (err: any) {
          return new Response(
            JSON.stringify({
              result: {
                status: 'in_progress',
                error: err.message,
                next_instruction: 'Please clarify the last answer with the customer.',
              },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
    },
  },
})
