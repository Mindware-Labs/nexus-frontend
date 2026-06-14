import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { getSessionUser } from '@/lib/session';
import { logoutAction } from '@/app/actions/auth';

export default async function PanelPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'customer') redirect('/login');

  return (
    <div className="flex min-h-screen flex-col bg-nexus-deep text-white">
      <header className="border-b border-white/10 bg-nexus-deep/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg">
              <Sparkles className="size-4 text-white" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Mindware <span className="text-nexus-lavender">Nexus</span>
            </span>
            <span className="ml-2 rounded-full bg-nexus-mint/20 px-2.5 py-0.5 text-xs font-medium text-nexus-mint">
              Customer
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/60 sm:block">{user.name}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold">Panel de Cliente</h1>
        <p className="text-white/50">Bienvenido, {user.name}. Tu panel se construirá aquí.</p>
      </main>
    </div>
  );
}
