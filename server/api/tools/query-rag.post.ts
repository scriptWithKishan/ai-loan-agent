import { defineEventHandler, readBody } from 'nitro/h3'
import { queryRag } from '../../../src/services/rag'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const args = body?.args || body || {}
    const query = args.query || ''

    if (!query) {
      return {
        result: {
          knowledge_context: 'No specific topic queried.',
        },
      }
    }

    const context = await queryRag(query)

    return {
      result: {
        knowledge_context: context || 'No specific document found; inform customer that a dedicated loan specialist will confirm the details.',
      },
    }
  } catch (err: any) {
    console.error('Error in query-rag webhook:', err)
    return {
      result: {
        knowledge_context: 'A loan specialist will confirm these details during the follow-up call.',
      },
    }
  }
})
