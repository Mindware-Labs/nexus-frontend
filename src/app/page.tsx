import Script from 'next/script'
import { ScrollProgress } from '@/components/landing/anim'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { StepsSection } from '@/components/landing/steps-section'
import { UseCasesSection } from '@/components/landing/use-cases-section'
import { KnowledgeBaseSection } from '@/components/landing/knowledge-base-section'
import { LeadScoringSection } from '@/components/landing/lead-scoring-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CtaSection } from '@/components/landing/cta-section'
import { SiteFooter } from '@/components/landing/site-footer'

export default function Home() {
  return (
    <div className="relative overflow-clip bg-black font-[family-name:var(--font-geist-sans)] text-white selection:bg-nexus-lavender selection:text-black">
<ScrollProgress />
      <Navbar />
      <Hero />
      <StepsSection />
      <LeadScoringSection />
      <UseCasesSection />
      <KnowledgeBaseSection />
      <PricingSection />
      <CtaSection />
      <SiteFooter />

      <Script id="nexus-widget" strategy="afterInteractive">{`
        (function () {
          var iframeId = "mindware-nexus-widget-nxbot_1957644b814ddb7ac1d5";
          var buttonId = iframeId + "-launcher";
          var panelOpen = false;
          var iframe = document.createElement("iframe");
          iframe.id = iframeId;
          iframe.src = "https://nexus-frontend-xi-blue.vercel.app/widget/nxbot_1957644b814ddb7ac1d5?embedded=1";
          iframe.style.position = "fixed";
          iframe.style.bottom = "88px";
          iframe.style.right = "24px";
          iframe.style.width = "380px";
          iframe.style.maxWidth = "calc(100vw - 32px)";
          iframe.style.height = "620px";
          iframe.style.maxHeight = "calc(100vh - 112px)";
          iframe.style.border = "0";
          iframe.style.borderRadius = "24px";
          iframe.style.boxShadow = "0 24px 64px rgba(0,0,0,0.22)";
          iframe.style.display = "none";
          iframe.style.zIndex = "999998";
          iframe.setAttribute("title", "Chat de Mindware Nexus");

          var button = document.createElement("button");
          button.id = buttonId;
          button.type = "button";
          button.textContent = "Abrir chat";
          button.style.position = "fixed";
          button.style.bottom = "24px";
          button.style.right = "24px";
          button.style.zIndex = "999999";
          button.style.border = "0";
          button.style.borderRadius = "999px";
          button.style.padding = "14px 18px";
          button.style.background = "#7C3AED";
          button.style.color = "#FFFFFF";
          button.style.font = "600 14px system-ui, sans-serif";
          button.style.boxShadow = "0 12px 30px rgba(0,0,0,0.18)";
          button.style.cursor = "pointer";

          button.addEventListener("click", function () {
            panelOpen = !panelOpen;
            iframe.style.display = panelOpen ? "block" : "none";
          });

          document.body.appendChild(iframe);
          document.body.appendChild(button);
        })();
      `}</Script>
    </div>
  )
}
