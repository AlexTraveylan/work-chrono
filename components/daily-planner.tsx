import { useEffect, useState } from 'react'
import { AffTestTask } from '../testdata/models/AffTestTask'
import { AreaPlanning } from './area-planing'
import { get_height_from, get_top_from_startedAt } from './shared/format'

export function DailyPlanner({
  startedAt,
  endedAt,
  daySessionId,
}: {
  startedAt: string
  endedAt: string
  daySessionId: number
}) {
  const [pauses, setPauses] = useState<AffTestTask[]>([])
  const [tasks, setTasks] = useState<AffTestTask[]>([])

  async function recupPause(daySessionId: number) {
    const response = await fetch(`/api/reviews/pauseReview`, {
      method: 'POST',
      body: JSON.stringify({ daySessionId: daySessionId }),
    })

    if (response.ok) {
      const data: { pauses: AffTestTask[] } = await response.json()
      const newPauses = data.pauses.map((pause) => {
        return {
          startedAt: pause.startedAt,
          endedAt: pause.endedAt,
          label: 'Pause',
        }
      })
      setPauses(newPauses)
    }
  }

  async function recupTask(daySessionId: number) {
    const response = await fetch(`/api/reviews/taskReview`, {
      method: 'POST',
      body: JSON.stringify({ daySessionId: daySessionId }),
    })

    if (response.ok) {
      const data: { tasks: AffTestTask[] } = await response.json()
      setTasks(data.tasks)
    }
  }

  useEffect(() => {
    recupPause(daySessionId)
    recupTask(daySessionId)
  }, [])

  const sizeDay = get_height_from(
    new Date(startedAt).getTime(),
    new Date(endedAt).getTime()
  )

  const beginDay = get_top_from_startedAt(new Date(startedAt).getTime())

  return (
    <div className="h-[28rem] my-2 rounded shadow-md relative">
      <div
        className="border-2 border-slate-200 absolute w-full rounded"
        style={{ height: `${sizeDay}%`, top: `${beginDay}%` }}
      ></div>
      {[...pauses, ...tasks].length > 0 && (
        <div className="h-full">
          {[...pauses, ...tasks]
            .sort(
              (a, b) =>
                new Date(a.startedAt).getTime() -
                new Date(b.startedAt).getTime()
            )
            .map((elem) => {
              console.log(elem)
              const sizeElem = get_height_from(
                new Date(elem.startedAt).getTime(),
                new Date(elem.endedAt).getTime()
              )

              const begin = get_top_from_startedAt(
                new Date(elem.startedAt).getTime()
              )
              return (
                <AreaPlanning
                  sizeElem={sizeElem}
                  begin={begin}
                  taskOrpause={elem}
                />
              )
            })}
        </div>
      )}
    </div>
  )
}
