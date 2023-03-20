import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import { AffResume } from '../components/aff-resume'
import Layout from '../components/layout'
import { DaySessionBdd } from '../testdata/models/DaySessionBdd'

export default function WeekReview() {
  const { data: session } = useSession()
  const [daySessionData, setDAySessionData] = useState<DaySessionBdd[]>()
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/reviews/weekReview`)
      if (response.ok) {
        const data = await response.json()
        setDAySessionData(data)
      }
    }
    fetchData()
  }, [])

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <Link href="protected">Retour</Link>
      <h1 className="text-5xl font-bold m-3">Resumé</h1>
      <div className="flex flex-row gap-3 flex-wrap">
        {daySessionData &&
          daySessionData.map((daySession) => (
            <div key={daySession.id}>
              <AffResume
                startedAt={daySession.startedAt}
                endedAt={daySession.endedAt}
              />
            </div>
          ))}
      </div>
    </Layout>
  )
}
