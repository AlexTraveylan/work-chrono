import { useEffect, useState } from 'react'
import { FakeTimer } from '../../testdata/models/FakeTimer'

export function TimerApp({
  title,
  BeginTimeStamp,
}: {
  title: string
  BeginTimeStamp: number | undefined
}) {
  const [timer, setTimer] = useState<FakeTimer>()
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
          hours: hours,
          minutes: minutes,
          secondes: seconds,
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
      {BeginTimeStamp && (
        <div className="p-3 rounded-md shadow-md">
          <h3 className="font-bold mb-3 text-center">{title}</h3>
          <div className="flex flex-row gap-3">
            <div className="flex flex-col items-center justify-center bg-cyan-200 p-2 min-w-[5rem] rounded shadow-md">
              <h5 className="font-bold">Heures</h5>
              <p>{timer?.hours}</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-cyan-200 p-2 min-w-[5rem] rounded shadow-md">
              <h5 className="font-bold">Minutes</h5>
              <p>{timer?.minutes}</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-cyan-200 p-2 min-w-[5rem] rounded shadow-md">
              <h5 className="font-bold">Secondes</h5>
              <p>{timer?.secondes}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
