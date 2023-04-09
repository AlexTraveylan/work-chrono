import { add, endOfWeek, startOfWeek } from 'date-fns'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import { DaySession, Pause, TaskSession } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { PauseService } from '../../../prisma/services/pause-service'
import { TaskSessionService } from '../../../prisma/services/task-session-service'

export type WeekReview = {
  daysSessions: DaySession[]
  pausesSessions: Pause[]
  tasksSessions: TaskSession[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const dService = new DaySessionService()
  const tService = new TaskSessionService()
  const pService = new PauseService()

  if (session?.user?.email && req.method == 'POST') {
    const { nb_month_back } = JSON.parse(req.body)
    const daysessions =
      await dService.getAllDaySessionsForUserFor_n_previousMonth(
        session.user.email,
        nb_month_back
      )

    if (daysessions && daysessions.length > 0) {
      const weeks: WeekReview[] = []
      const firstWeekStart = startOfWeek(daysessions[0].startedAt, {
        weekStartsOn: 1,
      })

      let currentWeekStart = firstWeekStart
      let currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })

      while (
        currentWeekStart <= daysessions[daysessions.length - 1].startedAt
      ) {
        const daysSessionsInWeek = daysessions.filter(
          (day) =>
            day.startedAt >= currentWeekStart && day.startedAt <= currentWeekEnd
        )

        const pausePromises = daysSessionsInWeek.map((ds) =>
          pService.getAllPausesByDaySessionId(ds.id)
        )
        const pausesSessionsInWeek = await Promise.all(pausePromises)

        const taskPromises = daysSessionsInWeek.map((ds) =>
          tService.getAllTaskSessionsForDaySession(ds.id)
        )
        const tasksSessionsInWeek = await Promise.all(taskPromises)

        weeks.push({
          daysSessions: daysSessionsInWeek,
          pausesSessions: pausesSessionsInWeek.flat(),
          tasksSessions: tasksSessionsInWeek.flat(),
        })

        currentWeekStart = add(currentWeekStart, { weeks: 1 })
        currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
      }

      return res.status(200).json(weeks)
    }
  }

  return res
    .status(400)
    .json({ error: 'Erreur dans la recuperation des données du mois' })
}
