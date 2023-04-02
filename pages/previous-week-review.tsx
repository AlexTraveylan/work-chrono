import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import { AffResume } from '../components/aff-resume'
import { DailyPlanner } from '../components/daily-planner'
import Layout from '../components/layout'
import { get_total_hours_and_minutes_from_timeStamp } from '../components/shared/format'
import { ReturnButton } from '../components/shared/return'
import { DaySessionBdd } from '../testdata/models/DaySessionBdd'

export default function WeekReview() {
  const { data: session } = useSession()
  const [daySessionData, setDaySessionData] = useState<DaySessionBdd[]>()
  const [
    totalTimeWorkMillisecondsToString,
    setTotalTimeWorkMillisecondsToString,
  ] = useState<string>()
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/reviews/previousWeekReview`)

      if (response.ok) {
        const daysSession: DaySessionBdd[] = await response.json()
        setDaySessionData(daysSession)

        // On ajoute le temps chaque jour de la semaine pour obtenir le total
        let calcTimeWoked = 0
        for (let daySession of daysSession) {
          const beginTimeStamp = new Date(daySession.startedAt).getTime()
          const endTimeStamp = new Date(daySession.endedAt).getTime()
          calcTimeWoked += endTimeStamp - beginTimeStamp
        }
        const hoursMinutes =
          get_total_hours_and_minutes_from_timeStamp(calcTimeWoked)
        setTotalTimeWorkMillisecondsToString(
          `${hoursMinutes.hour}h${hoursMinutes.minute}`
        )
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
      <ReturnButton path="/" />
      {totalTimeWorkMillisecondsToString && (
        <div className="flex flex-col items-center text-center gap-3 mb-5">
          <h1 className="text-3xl px-3">Nombre d'heures de la semaine : </h1>
          <h3 className="text-5xl text-teal-700">
            {totalTimeWorkMillisecondsToString}
          </h3>
        </div>
      )}
      <div className="flex flex-row gap-3 flex-wrap justify-center">
        {daySessionData &&
          daySessionData.map((daySession) => (
            <div key={daySession.id}>
              <AffResume
                startedAt={daySession.startedAt}
                endedAt={daySession.endedAt}
              />
              <DailyPlanner
                daySessionId={daySession.id}
                startedAt={daySession.startedAt}
                endedAt={daySession.endedAt}
              />
            </div>
          ))}
      </div>
    </Layout>
  )
}
