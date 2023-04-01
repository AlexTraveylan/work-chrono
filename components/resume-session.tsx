import { Dispatch, SetStateAction } from 'react'
import { ButtonApp } from './shared/buttonApp'

export function ResumeSession({
  beginSession,
  setBeginSession,
  setTaskTimer,
  setTaskName,
  setIsPause,
  isDaySession,
  sessionEndedAt,
}: {
  beginSession: number | undefined
  setBeginSession: Dispatch<SetStateAction<number | undefined>>
  setTaskTimer: Dispatch<SetStateAction<number | undefined>>
  setTaskName: Dispatch<SetStateAction<string>>
  setIsPause: Dispatch<SetStateAction<boolean>>
  isDaySession: boolean
  sessionEndedAt: number | undefined
}) {
  async function resume() {
    try {
      const response = await fetch(`/api/work/resume`)
      if (response.ok) {
        const data = await response.json()
        const startedAt = new Date(data.session.startedAt)
        setBeginSession(startedAt.getTime())
        if (data.task) {
          const currentTaskName = data.task.label
          const currentTaskStartedAt = new Date(data.task.startedAt)
          setTaskName(currentTaskName)
          setTaskTimer(currentTaskStartedAt.getTime())
        }
        if (data.pause) {
          setIsPause(true)
        }
      } else {
        // handle error
        console.error('Error fetching data')
      }
    } catch (error) {
      // handle error
      console.error(error)
    }
  }

  return (
    <>
      {!beginSession && isDaySession && !sessionEndedAt && (
        <div onClick={() => resume()}>
          <ButtonApp title="Reprendre la session en cours" />
        </div>
      )}
    </>
  )
}
