import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import Layout from '../components/layout'
import { ResumeSession } from '../components/resume-session'
import {
  formatOneorTwoDigitOnToTwoDigits,
  get_hour_minute_from_timeStamp,
} from '../components/shared/format'
import { Loader } from '../components/shared/loader'
import { ReturnButton } from '../components/shared/return'
import { TimerApp } from '../components/shared/timerApp'
import { TodayDateTitle } from '../components/shared/today-date-title'
import { StartDay } from '../components/start-day'
import { StartTask } from '../components/start-task'

export default function ProtectedPage() {
  const { data: session } = useSession()
  const [beginSession, setBeginSession] = useState<number>()
  const [taskTimer, setTaskTimer] = useState<number>()
  const [taskName, setTaskName] = useState('')
  const [isPause, setIsPause] = useState(false)
  const [isDaySession, setIsDaySession] = useState(false)
  const [sessionEndedAt, setSessionEndedAt] = useState<number | undefined>()
  const [beginToString, setBeginToString] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  async function seachDaySession() {
    const response = await fetch(`/api/work/isDaySession`)
    if (response.ok) {
      const data: { endedAt: string } = await response.json()
      if (data.endedAt) {
        const endedAt = new Date(data.endedAt).getTime()
        setSessionEndedAt(endedAt)
      } else {
        setIsDaySession(true)
      }
    } else {
      setIsDaySession(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    seachDaySession()
  }, [])

  useEffect(() => {
    if (beginSession) {
      const heuresMinutes = get_hour_minute_from_timeStamp(beginSession)

      setBeginToString(
        `${formatOneorTwoDigitOnToTwoDigits(
          heuresMinutes.hour
        )}h${formatOneorTwoDigitOnToTwoDigits(heuresMinutes.minute)}`
      )
    }
  }, [beginSession])

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
      <div className="mb-3">
        <TodayDateTitle />
      </div>
      {beginSession && <h3 className="text-2xl">Début : {beginToString}</h3>}
      <div className="flex flex-col items-center">
        <div className=" flex flex-col gap-3 m-3 flex-wrap justify-center">
          <Loader show={isLoading} />
          <StartDay
            isPause={isPause}
            setIsPause={setIsPause}
            setTaskTimer={setTaskTimer}
            beginSession={beginSession}
            setBeginSession={setBeginSession}
            isDaySession={isDaySession}
            sessionEndedAt={sessionEndedAt}
            setSessionEndedAt={setSessionEndedAt}
          />
          <ResumeSession
            setIsPause={setIsPause}
            setTaskTimer={setTaskTimer}
            setTaskName={setTaskName}
            beginSession={beginSession}
            setBeginSession={setBeginSession}
            isDaySession={isDaySession}
            sessionEndedAt={sessionEndedAt}
          />
        </div>
      </div>
      {!isPause && (
        <>
          <div className="flex flex-row justify-center gap-3 flex-wrap m-3">
            <TimerApp
              title="Temps total du jour"
              BeginTimeStamp={beginSession}
            />
            <TimerApp
              title={`Tache "${taskName}"`}
              BeginTimeStamp={taskTimer}
            />
          </div>
          {beginSession && (
            <StartTask
              taskName={taskName}
              setTaskName={setTaskName}
              taskTimer={taskTimer}
              setTaskTimer={setTaskTimer}
            />
          )}
        </>
      )}
    </Layout>
  )
}
