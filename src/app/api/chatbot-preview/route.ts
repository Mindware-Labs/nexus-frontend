export const runtime = 'nodejs'

import { backendFetch } from '@/lib/api'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { customerId?: unknown; message?: unknown; history?: unknown }
    | null

  const customerId = Number(body?.customerId)
  if (!Number.isFinite(customerId) || customerId <= 0 || typeof body?.message !== 'string') {
    return Response.json({ message: 'Solicitud de preview invalida' }, { status: 400 })
  }

  const response = await backendFetch(`/bot/customers/${customerId}/preview-chat`, {
    method: 'POST',
    body: JSON.stringify({
      message: body.message,
      history: Array.isArray(body.history) ? body.history : [],
    }),
  })

  const data = await response.json().catch(() => ({
    message: 'No se pudo interpretar la respuesta del backend',
  }))

  return Response.json(data, { status: response.status })
}
