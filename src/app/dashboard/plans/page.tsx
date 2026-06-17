import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { getPlans } from '@/app/actions/plans'
import { PlansUI } from './_ui'

export const metadata = { title: 'Planes — Mindware Nexus' }

export default async function PlansPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'owner') redirect('/login')

  const plans = await getPlans().catch(() => [])

  return (
    <div className="p-6 pb-12">
      <PlansUI plans={plans} />
    </div>
  )
}
