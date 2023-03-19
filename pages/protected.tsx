import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import { StartDay } from '../components/start-day'
import { TodayDateTitle } from '../components/shared/today-date-title'
import { TimerApp } from '../components/shared/timerApp'
import { StartTask } from '../components/start-task'
import { ResumeSession } from '../components/resume-session'
import Link from 'next/link'

export default function ProtectedPage() {
  const { data: session } = useSession()
  const [beginSession, setBeginSession] = useState<number>()
  const [taskTimer, setTaskTimer] = useState<number>()
  const [taskName, setTaskName] = useState('')
  const [isPause, setIsPause] = useState(false)

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
      <Link href="/">Retour</Link>
      <div className="m-3">
        <TodayDateTitle />
      </div>
      <div className="flex flex-col items-center">
        <div className=" flex flex-row gap-3 m-3">
          <StartDay
            isPause={isPause}
            setIsPause={setIsPause}
            setTaskTimer={setTaskTimer}
            beginSession={beginSession}
            setBeginSession={setBeginSession}
          />
          <ResumeSession
            setIsPause={setIsPause}
            setTaskTimer={setTaskTimer}
            setTaskName={setTaskName}
            beginSession={beginSession}
            setBeginSession={setBeginSession}
          />
        </div>
        <Link href="/week-review">Résumé de la semaine</Link>
      </div>
      {!isPause && (
        <>
          <div className="flex flex-row justify-center gap-3 flex-wrap m-3">
            <TimerApp title="Session" BeginTimeStamp={beginSession} />
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
