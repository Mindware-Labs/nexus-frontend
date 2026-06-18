import { ScrollProgress } from '@/components/landing/anim'
import { CtaSection } from '@/components/landing/cta-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { Hero } from '@/components/landing/hero'
import { PricingSection } from '@/components/landing/pricing-section'
import { SiteFooter } from '@/components/landing/site-footer'
import { StatsSection } from '@/components/landing/stats-section'
import { StepsSection } from '@/components/landing/steps-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'

export default function Home() {
  return (
    <div
      className="relative overflow-x-hidden bg-background font-[family-name:var(--font-geist-sans)] text-foreground"
      style={
        {
          '--background': 'hsl(260 87% 3%)',
          '--foreground': 'hsl(40 6% 95%)',
        } as React.CSSProperties
      }
    >
      <ScrollProgress />
      <Hero />
      <StepsSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <SiteFooter />
    </div>
  )
}
