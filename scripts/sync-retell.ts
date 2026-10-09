import Retell from 'retell-sdk'
import { buildSystemPrompt } from '../src/prompts/system-prompt'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

async function main() {
  console.log('🚀 Synchronizing Retell AI Agent and Tools...')

  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey || apiKey.startsWith('key_xxx')) {
    console.error('❌ Error: Valid RETELL_API_KEY is required in .env.')
    console.log('Get your API key at: https://beta.retellai.com/')
    process.exit(1)
  }

  let appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '')
  let webhookBaseUrl = appUrl
  if (webhookBaseUrl.includes('localhost') || webhookBaseUrl.includes('127.0.0.1')) {
    webhookBaseUrl = 'https://lap-ai-voicechat.vercel.app'
    console.log(`⚠️ Notice: Retell AI requires a public HTTPS URL for webhooks.`)
    console.log(`   Using provisional URL: ${webhookBaseUrl}`)
    console.log(`   Once deployed on Vercel, update APP_URL in .env and re-run pnpm run retell:sync.`)
  } else {
    console.log(`Using Base Webhook URL: ${webhookBaseUrl}`)
  }

  const client = new Retell({ apiKey })

  const prompt = buildSystemPrompt({
    companyName: process.env.COMPANY_NAME || 'Sunrise Capital',
    customerName: '{{customer_name}}',
    agentName: 'Ananya',
    agentGender: 'female',
    languageToSpeak: 'English',
  })

  // 1. Define custom tools for Retell LLM
  const eligibilityTool: Retell.LlmCreateParams.CustomTool = {
    type: 'custom',
    name: 'check_eligibility',
    description: 'Evaluates customer preliminary loan eligibility deterministically. MUST be called whenever customer shares property type, ownership, documents availability, loan amount, income mode, market value, or tenure.',
    url: `${webhookBaseUrl}/api/tools/check-eligibility`,
    speak_during_execution: true,
    execution_message_description: 'A brief 1-second conversational filler while verifying details, such as "Let me check that criteria..."',
    parameters: {
      type: 'object',
      properties: {
        call_id: { type: 'string', description: 'Internal Call session ID' },
        property_type: {
          type: 'string',
          enum: ['residential', 'commercial', 'industrial', 'agricultural', 'other'],
          description: 'Type of property',
        },
        ownership: {
          type: 'string',
          enum: ['sole', 'joint'],
          description: 'Sole owner or joint ownership',
        },
        original_documents: {
          type: 'boolean',
          description: 'True if original title deeds are available for verification, false otherwise',
        },
        loan_amount_inr: {
          type: 'number',
          description: 'Requested loan amount in Indian Rupees (INR)',
        },
        occupation: {
          type: 'string',
          enum: ['salaried', 'self_employed'],
          description: 'Employment type',
        },
        income_mode: {
          type: 'string',
          enum: ['bank', 'cash'],
          description: 'Mode of income receipt (bank or cash)',
        },
        market_value_inr: {
          type: 'number',
          description: 'Estimated market valuation of the property in INR',
        },
        tenure_years: {
          type: 'number',
          description: 'Requested repayment tenure in years',
        },
      },
    },
  }

  const ragTool: Retell.LlmCreateParams.CustomTool = {
    type: 'custom',
    name: 'query_rag_knowledge',
    description: 'Queries official LAP guidelines and product knowledge when the customer asks specific questions about interest rates, acceptable documents, process, or objections.',
    url: `${webhookBaseUrl}/api/tools/query-rag`,
    speak_during_execution: false,
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The exact question or topic the customer asked about',
        },
      },
      required: ['query'],
    },
  }

  const endCallTool: Retell.LlmCreateParams.EndCallTool = {
    type: 'end_call',
    name: 'end_call',
    description: 'Ends the call politely when call is concluded, customer requests callback, wrong person answered, or customer asks to not be called.',
  }

  console.log('Creating/Updating Retell LLM Response Engine...')
  const llm = await client.llm.create({
    model: 'gemini-3.0-flash',
    general_prompt: prompt,
    general_tools: [eligibilityTool, ragTool, endCallTool],
    begin_message: 'Hi, am I speaking with {{customer_name}}? This is Ananya from Sunrise Capital.',
    default_dynamic_variables: {
      customer_name: 'there',
    },
  })

  console.log(`✓ Retell LLM created with ID: ${llm.llm_id}`)

  console.log('Creating Retell Voice Agent...')
  const agent = await client.agent.create({
    agent_name: 'LAP AI Voice Advisor (Production)',
    response_engine: {
      type: 'retell-llm',
      llm_id: llm.llm_id,
    },
    voice_id: '11labs-Adrian', // High quality conversational voice
    webhook_url: `${webhookBaseUrl}/api/webhooks/retell`,
  })

  console.log(`✅ Retell Agent successfully created!`)
  console.log(`===============================================`)
  console.log(`Agent ID: ${agent.agent_id}`)
  console.log(`LLM ID:   ${llm.llm_id}`)
  console.log(`===============================================`)

  // Automatically update or append RETELL_AGENT_ID in .env
  const envPath = path.resolve(process.cwd(), '.env')
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''
  if (envContent.includes('RETELL_AGENT_ID=')) {
    envContent = envContent.replace(/RETELL_AGENT_ID=.*$/m, `RETELL_AGENT_ID=${agent.agent_id}`)
  } else {
    envContent += `\nRETELL_AGENT_ID=${agent.agent_id}\n`
  }
  fs.writeFileSync(envPath, envContent, 'utf8')
  console.log('✓ Updated RETELL_AGENT_ID in .env')
}

main().catch(err => {
  console.error('Error during Retell sync:', err)
  process.exit(1)
})
