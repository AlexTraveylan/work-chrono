import { useEffect, useState } from 'react'
import { formatOneorTwoDigitOnToTwoDigits } from './format'

export function TimerApp({
  title,
  BeginTimeStamp,
}: {
  title: string
  BeginTimeStamp: number | undefined
}) {
  const [timer, setTimer] = useState<{
    hours: string
    minutes: string
    secondes: string
  }>()
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (BeginTimeStamp && isRunning) {
      intervalId = setInterval(() => {
        const now = new Date().getTime()
        const diff = now - BeginTimeStamp
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimer({
          hours: formatOneorTwoDigitOnToTwoDigits(hours),
          minutes: formatOneorTwoDigitOnToTwoDigits(minutes),
          secondes: formatOneorTwoDigitOnToTwoDigits(seconds),
        })
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [BeginTimeStamp, isRunning])

  function stopTimer() {
    setIsRunning(false)
  }

  return (
    <>
      {BeginTimeStamp && timer && (
        <div className="p-3">
          <h3 className="font-bold mb-3 text-center">{title}</h3>
          <div className="flex flex-row gap-3">
            <div className="flex flex-col items-center justify-center p-2 min-w-[5rem] rounded shadow-md">
              <h5 className="font-semibold">Heures</h5>
              <p>{timer.hours}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 min-w-[5rem] rounded shadow-md">
              <h5 className="font-semibold">Minutes</h5>
              <p>{timer.minutes}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2 min-w-[5rem] rounded shadow-md">
              <h5 className="font-semibold">Secondes</h5>
              <p>{timer.secondes}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
