import { DaySession, Pause, TaskSession } from '@prisma/client'
import {
  formatDatefromTimestamp,
  formatOneorTwoDigitOnToTwoDigits,
  get_total_hours_and_minutes_from_timeStamp,
} from './shared/format'

type FormatedDaySession = {
  begin: string
  end: string
  totaltime: string
}

type FormatedLabelSession = {
  label: string
  totaltime?: string
  tempTime?: number
}

export function ReviewWeekCard({
  daysSession,
  pausesSession,
  tasksSession,
}: {
  daysSession: DaySession[]
  pausesSession: Pause[]
  tasksSession: TaskSession[]
}) {
  const dateBeginWeek = formatDatefromTimestamp(
    daysSession[0].startedAt.getTime()
  )

  const dateEndWeek = formatDatefromTimestamp(
    daysSession[daysSession.length - 1].startedAt.getTime()
  )

  const totalTimeWorkInMilliseconds = daysSession.reduce((acc, curr) => {
    if (curr.endedAt && curr.startedAt) {
      return acc + (curr.endedAt.getTime() - curr.startedAt.getTime())
    } else {
      return acc
    }
  }, 0)

  const getTotalTimeFormated = get_total_hours_and_minutes_from_timeStamp(
    totalTimeWorkInMilliseconds
  )

  const totalPausesInMilliseconds = pausesSession.reduce((acc, curr) => {
    if (curr.endedAt && curr.startedAt) {
      return acc + (curr.endedAt.getTime() - curr.startedAt.getTime())
    } else {
      return acc
    }
  }, 0)

  const getTotalPausesFormated = get_total_hours_and_minutes_from_timeStamp(
    totalPausesInMilliseconds
  )

  const getTotalWorkWithPauseFormated =
    get_total_hours_and_minutes_from_timeStamp(
      totalTimeWorkInMilliseconds - totalPausesInMilliseconds
    )

  const realWorkTimeFormated = `${
    getTotalWorkWithPauseFormated.hour
  }h${formatOneorTwoDigitOnToTwoDigits(getTotalWorkWithPauseFormated.minute)}`

  const pauseFormated: FormatedLabelSession = {
    label: 'Pauses',
    totaltime: `${
      getTotalPausesFormated.hour
    }h${formatOneorTwoDigitOnToTwoDigits(getTotalPausesFormated.minute)}`,
  }

  const weekFormated: FormatedDaySession = {
    begin: dateBeginWeek,
    end: dateEndWeek,
    totaltime: `${getTotalTimeFormated.hour}h${formatOneorTwoDigitOnToTwoDigits(
      getTotalTimeFormated.minute
    )}`,
  }

  const taskFormatedDict: FormatedLabelSession[] = []

  for (const task of tasksSession) {
    if (task?.endedAt && task?.startedAt) {
      const duration = task.endedAt.getTime() - task.startedAt.getTime()
      if (
        taskFormatedDict.filter((obj) => obj.label == task.label).length == 1
      ) {
        const foundTaskWithLabel = taskFormatedDict.find(
          (session) => session.label === task.label
        )

        if (foundTaskWithLabel?.tempTime) {
          foundTaskWithLabel.tempTime += duration
        } else {
          console.error('Impossible de trouver le label')
        }
      } else {
        const newFormatedTask = {
          label: task.label,
          tempTime: duration,
        }
        taskFormatedDict.push(newFormatedTask)
      }
    } else {
      console.error('Impossible de trouver les informations de la tache')
    }
  }

  for (const task of taskFormatedDict) {
    if (task.tempTime) {
      const getTotalTimeFormated = get_total_hours_and_minutes_from_timeStamp(
        task.tempTime
      )
      task.totaltime = `${
        getTotalTimeFormated.hour
      }h${formatOneorTwoDigitOnToTwoDigits(getTotalTimeFormated.minute)}`
    } else {
      console.error('Impossible de calculer le temps total de la tache')
    }
  }

  return (
    <div className="flex flex-col items-center rounded shadow-md p-3">
      <h1 className="text-xl text-center">
        Du {weekFormated.begin} au {weekFormated.end}
      </h1>
      <div className="flex flex-row flex-wrap items-center justify-center gap-3">
        <h2 className="text-xl rounded shadow p-3 my-3">
          Présence : {weekFormated.totaltime}
        </h2>
        <h2 className="text-xl rounded shadow p-3 my-3">
          Pauses : {pauseFormated.totaltime}
        </h2>
      </div>
      <div>
        <h2 className="text-3xl my-4 text-pink-800">{realWorkTimeFormated}</h2>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold">Taches</h2>
        <div className="flex flex-col items-center">
          {taskFormatedDict.map((task) => {
            return (
              <div key={task.label}>
                <h2 className="text-xl">
                  {task.label} : {task.totaltime}
                </h2>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
