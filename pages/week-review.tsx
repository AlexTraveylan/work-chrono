import { DaySession } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import Layout from '../components/layout'

export default function WeekReview() {
  const { data: session } = useSession()
  const [daySessionData, setDAySessionData] = useState<DaySession[]>()
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
      <h1>On week-review</h1>
      {daySessionData &&
        daySessionData.map((daySession) => (
          <div key={daySession.id}>
            <span>{daySession.id}</span>
            <span>{new Date(daySession.startedAt).toISOString()}</span>
            <span>
              {daySession.endedAt
                ? new Date(daySession.endedAt).toISOString()
                : 'N/A'}
            </span>
            <span>{daySession.userId}</span>
          </div>
        ))}
    </Layout>
  )
}
