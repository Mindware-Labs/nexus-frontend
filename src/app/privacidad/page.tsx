import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { MotionProvider } from "@/components/landing/motion-provider";
import { DEFAULT_PRIVACY_POLICY } from "@/lib/default-privacy-policy";
import { SiteFooter } from "@/components/landing/site-footer";

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
      <div className="relative min-h-screen bg-[#020202] text-white selection:bg-nexus-lavender selection:text-black flex flex-col">
        {/* Ambient Glows */}
        <div className="pointer-events-none fixed inset-0 z-0 flex justify-center">
          <div className="absolute top-[-10%] h-[500px] w-[800px] rounded-full bg-nexus-purple/10 blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-nexus-lavender/5 blur-[100px] mix-blend-screen" />
        </div>

        <Navbar />

        <main className="relative z-10 flex-1 pt-32 pb-24 px-6 md:px-12">
          <div className="mx-auto max-w-4xl">
            
            {/* Header Section */}
            <div className="mb-12">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(173,116,195,0.15)]">
                    <Shield className="h-6 w-6 text-nexus-lavender" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                      Política de Privacidad
                    </h1>
                    <p className="mt-2 text-sm tracking-widest text-nexus-lavender/60 uppercase font-medium">
                      Mindware Labs, Rep. Dom.
                    </p>
                  </div>
                </div>
                
                {updatedAt && (
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50 backdrop-blur-md">
                    Actualizado: {new Date(updatedAt).toLocaleDateString("es", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Content Document */}
            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-2xl md:p-12 relative overflow-hidden">
              {/* Subtle top border glow */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="prose prose-invert max-w-none">
                <pre className="font-sans text-sm leading-[1.8] md:text-base md:leading-loose text-gray-300 whitespace-pre-wrap">
                  {policyText}
                </pre>
              </div>
            </div>

            {/* Footer Contact */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-[1.5rem] border border-nexus-lavender/20 bg-[linear-gradient(90deg,rgba(82,37,102,0.1),rgba(17,17,17,0.5))] px-8 py-6 backdrop-blur-xl">
              <p className="text-sm text-white/70">
                Para consultas sobre privacidad o ejercer tus derechos ARCO, contáctanos.
              </p>
              <a
                href="mailto:labsmindware@gmail.com"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs font-bold tracking-[0.14em] text-black uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                labsmindware@gmail.com
              </a>
            </div>

          </div>
        </main>
        
        <SiteFooter />
      </div>
    </MotionProvider>
  );
}
