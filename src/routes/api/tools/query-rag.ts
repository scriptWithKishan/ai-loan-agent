import { createFileRoute } from '@tanstack/react-router'
import { queryRag } from '../../../services/rag'

export const Route = createFileRoute('/api/tools/query-rag')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const args = body?.args || body || {}
          const query = args.query || ''

          if (!query) {
            return new Response(
              JSON.stringify({
                result: {
                  knowledge_context: 'No specific topic queried.',
                },
              }),
              {
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const context = await queryRag(query)

          return new Response(
            JSON.stringify({
              result: {
                knowledge_context:
                  context ||
                  'No specific document found; inform customer that a dedicated loan specialist will confirm the details.',
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
                knowledge_context: 'A loan specialist will confirm these details during the follow-up call.',
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
