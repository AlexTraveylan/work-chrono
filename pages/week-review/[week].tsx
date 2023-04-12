import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from '../../components/access-denied'
import { AffResume } from '../../components/aff-resume'
import { DailyPlanner } from '../../components/daily-planner'
import Layout from '../../components/layout'
import {
  formatOneorTwoDigitOnToTwoDigits,
  get_total_hours_and_minutes_from_timeStamp,
} from '../../components/shared/format'
import { Loader } from '../../components/shared/loader'
import { ReturnButton } from '../../components/shared/return'
import { AffTestTask } from '../../testdata/models/AffTestTask'
import { DaySessionBdd } from '../../testdata/models/DaySessionBdd'

export default function WeekReview({ week }: { week: string }) {
  const { data: session } = useSession()
  const [daySessionData, setDaySessionData] = useState<DaySessionBdd[]>()
  const [
    totalTimeWorkMillisecondsToString,
    setTotalTimeWorkMillisecondsToString,
  ] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  async function fetchData() {
    const response = await fetch(`/api/reviews/previousWeekReview`, {
      method: 'POST',
      body: JSON.stringify({ week: week }),
    })

    if (response.ok) {
      const daysSession: DaySessionBdd[] = await response.json()
      setDaySessionData(daysSession)

      // On ajoute le temps chaque jour de la semaine pour obtenir le total
      let calcTimeWoked = 0
      for (let daySession of daysSession) {
        const beginTimeStamp = new Date(daySession.startedAt).getTime()
        const endTimeStamp = new Date(daySession.endedAt).getTime()
        const response = await fetch(`/api/reviews/pauseReview`, {
          method: 'POST',
          body: JSON.stringify({ daySessionId: daySession.id }),
        })
        if (response.ok) {
          const pauses: { pauses: AffTestTask[] } = await response.json()
          const timePauses = pauses.pauses.reduce((acc, curr) => {
            const beginpause = new Date(curr.startedAt).getTime()
            const endpause = new Date(curr.endedAt).getTime()
            return acc + (endpause - beginpause)
          }, 0)
          calcTimeWoked += endTimeStamp - beginTimeStamp - timePauses
        }
      }

      const hoursMinutes =
        get_total_hours_and_minutes_from_timeStamp(calcTimeWoked)

      setTotalTimeWorkMillisecondsToString(
        `${formatOneorTwoDigitOnToTwoDigits(
          hoursMinutes.hour
        )}h${formatOneorTwoDigitOnToTwoDigits(hoursMinutes.minute)}`
      )
    }
    setIsLoading(false)
  }

  useEffect(() => {
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
      <Loader show={isLoading} />
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
          daySessionData
            .sort(
              (a, b) =>
                new Date(a.startedAt).getTime() -
                new Date(b.startedAt).getTime()
            )
            .map((daySession) => (
              <div key={daySession.id}>
                <AffResume
                  daySessionId={daySession.id}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const week = context.params?.week as string

  return {
    props: {
      week,
    },
  }
}
