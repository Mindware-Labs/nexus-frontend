import { Shield } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { MotionProvider } from "@/components/landing/motion-provider";
import { DEFAULT_PRIVACY_POLICY } from "@/lib/default-privacy-policy";

export const metadata = {
  title: "Política de Privacidad — Mindware Nexus",
  description:
    "Conoce cómo Mindware Nexus trata tus datos personales conforme a la Ley 172-13 de la República Dominicana.",
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

interface PublicPrivacy {
  consentText: string;
  privacyPolicyUrl: string;
  policyText: string;
  updatedAt: string | null;
}

async function fetchPublicPrivacy(): Promise<PublicPrivacy | null> {
  if (!BACKEND) return null;

  // En desarrollo permitimos que la landing funcione sin backend.
  if (process.env.NODE_ENV === "development") return null;

  try {
    const res = await fetch(`${BACKEND}/bot/public/privacy`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<PublicPrivacy>;
  } catch {
    return null;
  }
}

export default async function PrivacidadPage() {
  const data = await fetchPublicPrivacy();
  const policyText = data?.policyText || DEFAULT_PRIVACY_POLICY;
  const updatedAt = data?.updatedAt ?? null;

  return (
    <MotionProvider>
      <Navbar />
      <main className="flex-1 bg-nexus-deep text-white/90">
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg shadow-nexus-purple/30">
              <Shield className="size-5 text-white" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Política de Privacidad
              </h1>
              <p className="mt-0.5 text-sm text-white/50">
                Mindware Labs, República Dominicana
              </p>
            </div>
          </div>

          {updatedAt && (
            <p className="mb-6 text-xs text-white/40">
              Última actualización:{" "}
              {new Date(updatedAt).toLocaleDateString("es", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <pre className="font-[inherit] text-sm leading-relaxed whitespace-pre-wrap text-white/80">
              {policyText}
            </pre>
          </div>

          <div className="mt-8 rounded-xl border border-nexus-lavender/20 bg-nexus-purple/10 px-5 py-4 text-sm text-white/70">
            Para consultas sobre privacidad o ejercer tus derechos ARCO,
            escríbenos a{" "}
            <a
              href="mailto:labsmindware@gmail.com"
              className="text-nexus-lavender hover:underline"
            >
              labsmindware@gmail.com
            </a>
          </div>
        </div>
      </main>
    </MotionProvider>
  );
}
