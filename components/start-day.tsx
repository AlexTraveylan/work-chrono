import { DaySession } from '@prisma/client'
import { Dispatch, SetStateAction } from 'react'
import { ButtonApp } from './shared/buttonApp'

export function StartDay({
  beginSession,
  setBeginSession,
  setTaskTimer,
  isPause,
  setIsPause,
}: {
  beginSession: number | undefined
  setBeginSession: Dispatch<SetStateAction<number | undefined>>
  setTaskTimer: Dispatch<SetStateAction<number | undefined>>
  isPause: boolean
  setIsPause: Dispatch<SetStateAction<boolean>>
}) {
  async function beginWork() {
    try {
      const response = await fetch(`/api/work/begin`)
      if (response.ok) {
        const data: DaySession = await response.json()
        const startedAtDate = new Date(data.startedAt)
        setBeginSession(startedAtDate.getTime())
      } else {
        // handle error
        console.error('Error fetching data')
      }
    } catch (error) {
      // handle error
      console.error(error)
    }
  }

  async function endWork() {
    if (beginSession) {
      try {
        const response0 = await fetch(`/api/work/end`)
        if (response0.ok) {
          // Posibilité de recuperer endedAt ici
          setBeginSession(undefined)
          const response1 = await fetch(`/api/work/saveTask`)
          if (response1.ok) {
            setTaskTimer(undefined)
          }
          const response2 = await fetch(`/api/work/savePause`)
          if (response2.ok) {
            setIsPause(false)
          }
        }
      } catch (error) {
        // handle error
        console.error(error)
      }
    }
  }

  async function beginPause() {
    const response = await fetch(`/api/work/beginPause`)
    if (response.ok) {
      setIsPause(true)
      const response = await fetch(`/api/work/saveTask`)

      if (response.ok) {
        setTaskTimer(undefined)
      }
    }
  }

  async function endPause() {
    const response = await fetch(`/api/work/savePause`)
    if (response.ok) {
      setIsPause(false)
    }
  }

  return (
    <>
      {beginSession ? (
        <div className="flex flex-row gap-3">
          <div onClick={() => endWork()}>
            <ButtonApp title="Fin de la session" />
          </div>
          {isPause ? (
            <div className="text-red-800 font-bold" onClick={() => endPause()}>
              <ButtonApp title="Reprendre" />
            </div>
          ) : (
            <div onClick={() => beginPause()}>
              <ButtonApp title="Faire une pause" />
            </div>
          )}
        </div>
      ) : (
        <div onClick={() => beginWork()}>
          <ButtonApp title="Démarrer la session" />
        </div>
      )}
    </>
  )
}
