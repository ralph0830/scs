import HomeClient from '@/components/HomeClient'
import { getAuth } from '@/lib/auth'

export default async function HomePage() {
  const auth = await getAuth()

  return <HomeClient user={auth} />
}
