import { MotionProvider } from '@/components/landing/motion-provider'
import { Navbar } from '@/components/landing/navbar'

export default function Home() {
  return (
    <MotionProvider>
      <Navbar />
      <main className="min-h-screen flex-1 bg-nexus-deep pt-16" />
    </MotionProvider>
  )
}
