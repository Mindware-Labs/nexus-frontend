export const runtime = 'nodejs';

const BACKEND = process.env.BACKEND_URL;

export async function POST(request: Request) {
  if (!BACKEND) {
    return Response.json(
      { message: 'Falta configurar BACKEND_URL en el frontend' },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { message?: unknown }
    | null;

  if (!body || typeof body.message !== 'string' || body.message.trim().length === 0) {
    return Response.json(
      { message: 'Debes enviar un mensaje valido' },
      { status: 400 },
    );
  }

  const response = await fetch(`${BACKEND}/bot/test-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: body.message.trim() }),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({
    message: 'No se pudo interpretar la respuesta del backend',
  }));

  return Response.json(data, { status: response.status });
}
