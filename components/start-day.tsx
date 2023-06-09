import { DaySession } from '@prisma/client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ButtonApp } from './shared/buttonApp'
import {
  formatOneorTwoDigitOnToTwoDigits,
  get_hour_minute_from_timeStamp,
} from './shared/format'

export function StartDay({
  beginSession,
  setBeginSession,
  setTaskTimer,
  isPause,
  setIsPause,
  isDaySession,
  sessionEndedAt,
  setSessionEndedAt,
}: {
  beginSession: number | undefined
  isDaySession: boolean
  setBeginSession: Dispatch<SetStateAction<number | undefined>>
  setTaskTimer: Dispatch<SetStateAction<number | undefined>>
  isPause: boolean
  setIsPause: Dispatch<SetStateAction<boolean>>
  sessionEndedAt: number | undefined
  setSessionEndedAt: Dispatch<SetStateAction<number | undefined>>
}) {
  const [endTime, setEntime] = useState<string>()

  useEffect(() => {
    if (sessionEndedAt) {
      const time = get_hour_minute_from_timeStamp(sessionEndedAt)
      setEntime(
        `${formatOneorTwoDigitOnToTwoDigits(
          time.hour
        )}h${formatOneorTwoDigitOnToTwoDigits(time.minute)}`
      )
    }
  }, [sessionEndedAt])

  async function beginWork() {
    const response = await fetch(`/api/work/begin`)
    if (response.ok) {
      const data: DaySession = await response.json()
      const startedAtDate = new Date(data.startedAt)
      setBeginSession(startedAtDate.getTime())
    }
  }

  async function endWork() {
    if (beginSession) {
      const response0 = await fetch(`/api/work/end`)
      if (response0.ok) {
        const { endedAt }: { endedAt: number } = await response0.json()
        setSessionEndedAt(endedAt)
        setBeginSession(undefined)
        const response1 = await fetch(`/api/work/saveTask`)
        const response2 = await fetch(`/api/work/savePause`)
        if (response1.ok && response2.ok) {
          setTaskTimer(undefined)
          setIsPause(false)
          await fetch(`/api/work/purge`)
        }
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
        <div className="flex flex-col gap-3 flex-wrap items-center justify-center">
          <div onClick={() => endWork()}>
            <ButtonApp>Finir et sauvegarder la journée</ButtonApp>
          </div>
          {isPause ? (
            <div className="text-teal-800" onClick={() => endPause()}>
              {/* Bouton Reprendre */}
              <ButtonApp>
                <svg
                  className="hover:scale-110 ease-in duration-100"
                  width="23"
                  height="23"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.25 12 5.75 5.75v12.5L18.25 12Z"></path>
                </svg>
              </ButtonApp>
            </div>
          ) : (
            <div className="text-red-800" onClick={() => beginPause()}>
              {/* Bouton pause */}
              <ButtonApp>
                <svg
                  className="hover:scale-110 ease-in duration-100"
                  width="23"
                  height="23"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.25 6.75v10.5"></path>
                  <path d="M8.75 6.75v10.5"></path>
                </svg>
              </ButtonApp>
            </div>
          )}
        </div>
      ) : (
        <>
          {sessionEndedAt ? (
            <div className="text-xl flex flex-col gap-3 items-center">
              <h3>Journée terminée à :</h3>
              <div>{endTime}</div>
              <div>A demain 😊</div>
            </div>
          ) : (
            <div
              onClick={() => beginWork()}
              className="flex flex-col gap-3 items-center"
            >
              {isDaySession ? (
                <ButtonApp>
                  <span className="text-red-900">Nouvelle session</span>
                </ButtonApp>
              ) : (
                <ButtonApp>
                  <span className="text-green-950">Démarrer une session</span>
                </ButtonApp>
              )}

              {!isDaySession && (
                <h4 className="text-red-800">
                  Aucune session en cours detectée
                </h4>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}
