import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { PauseService } from '../../../prisma/services/pause-service'
import { TaskSessionService } from '../../../prisma/services/task-session-service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const dService = new DaySessionService()
  const tService = new TaskSessionService()
  const pService = new PauseService()

  if (session?.user?.email) {
    const daysLogged = await dService.getAllDaySessionsForUser(1)
    console.log(daysLogged)

    return res.status(200).json(daysLogged)
  }

  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
