import dynamic from "next/dynamic";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MotionProvider } from "@/components/landing/motion-provider";
import { Navbar } from "@/components/landing/navbar";

/* Secciones bajo el fold: code-splitting para que el chunk inicial solo
   lleve navbar + hero. Se siguen prerenderizando en el HTML (SSR), pero
   su JS llega en chunks separados después de hidratar lo visible. */
const UseCases = dynamic(() =>
  import("@/components/landing/use-cases").then((m) => m.UseCases),
);
const PremiumShowcase = dynamic(() =>
  import("@/components/landing/premium-showcase").then(
    (m) => m.PremiumShowcase,
  ),
);
const DemoChat = dynamic(() =>
  import("@/components/landing/demo-chat").then((m) => m.DemoChat),
);
const Pricing = dynamic(() =>
  import("@/components/landing/pricing").then((m) => m.Pricing),
);
const Testimonials = dynamic(() =>
  import("@/components/landing/testimonials").then((m) => m.Testimonials),
);
const Contact = dynamic(() =>
  import("@/components/landing/contact").then((m) => m.Contact),
);
const NexusWidget = dynamic(() =>
  import("@/components/landing/nexus-widget").then((m) => m.NexusWidget),
);

export default function Home() {
  return (
    <MotionProvider>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <UseCases />
        <PremiumShowcase />
        <DemoChat />
        <Pricing />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <NexusWidget />
    </MotionProvider>
  );
}
