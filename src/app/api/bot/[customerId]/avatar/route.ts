import { type NextRequest, NextResponse } from 'next/server'
import { backendFetchFormData } from '@/lib/api'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ message: 'FormData inválido' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ message: 'No se recibió ningún archivo' }, { status: 400 })
  }

  const upstream = new FormData()
  upstream.append('file', file)

  const res = await backendFetchFormData(`/bot/customers/${customerId}/avatar`, upstream)
  const data = await res.json().catch(() => ({ message: 'Error inesperado' }))

  return NextResponse.json(data, { status: res.status })
}
