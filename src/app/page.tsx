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
import { LoadingScreen } from '@/components/landing/loading-screen'

export default function Home() {
  return (
    <div className="relative overflow-clip bg-black font-[family-name:var(--font-geist-sans)] text-white selection:bg-nexus-lavender selection:text-black">
      <LoadingScreen />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <StepsSection />
      <UseCasesSection />
      <KnowledgeBaseSection />
      <LeadScoringSection />
      <PricingSection />
      <CtaSection />
      <SiteFooter />
    </div>
  )
}
