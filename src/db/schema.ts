import { pgTable, text, timestamp, boolean, integer, bigint, jsonb, vector } from 'drizzle-orm/pg-core'

export const calls = pgTable('calls', {
  id: text('id').primaryKey(),
  retellCallId: text('retell_call_id').unique(),
  customerName: text('customer_name').notNull(),
  phoneNumber: text('phone_number'),
  agentName: text('agent_name').notNull(),
  agentGender: text('agent_gender').notNull(),
  language: text('language').notNull().default('English'),
  
  callStatus: text('call_status').notNull().default('registered'), // registered | ongoing | ended | error
  eligibilityStatus: text('eligibility_status').notNull().default('in_progress'), // in_progress | eligible | not_eligible | callback_requested | wrong_person | declined
  disqualificationReason: text('disqualification_reason'),
  disqualificationStep: text('disqualification_step'),

  // 7-point Checklist Collected Fields
  propertyType: text('property_type'),
  ownership: text('ownership'),
  originalDocuments: boolean('original_documents'),
  loanAmountInr: bigint('loan_amount_inr', { mode: 'number' }),
  occupation: text('occupation'),
  incomeMode: text('income_mode'),
  marketValueInr: bigint('market_value_inr', { mode: 'number' }),
  tenureYears: integer('tenure_years'),

  callbackTime: text('callback_time'),
  transcript: jsonb('transcript').$type<Array<{ role: 'agent' | 'user'; content: string; timestamp?: number }>>().default([]),
  recordingUrl: text('recording_url'),
  durationSeconds: integer('duration_seconds'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const knowledgeChunks = pgTable('knowledge_chunks', {
  id: text('id').primaryKey(),
  topic: text('topic').notNull(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 768 }),
  category: text('category').notNull().default('faq'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Call = typeof calls.$inferSelect
export type NewCall = typeof calls.$inferInsert
export type KnowledgeChunk = typeof knowledgeChunks.$inferSelect
export type NewKnowledgeChunk = typeof knowledgeChunks.$inferInsert
