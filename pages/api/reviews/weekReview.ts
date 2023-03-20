import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { PauseService } from '../../../prisma/services/pause-service'
import { TaskSessionService } from '../../../prisma/services/task-session-service'
import { UserAppService } from '../../../prisma/services/user-app-service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const dService = new DaySessionService()
  const tService = new TaskSessionService()
  const pService = new PauseService()
  const uService = new UserAppService()

  if (session?.user?.email) {
    const currentUser = await uService.getUserAppByEmail(session.user.email)
    if (currentUser?.id) {
      const daysLogged = await dService.getAllDaySessionsForUser(currentUser.id)
      return res.status(200).json(daysLogged)
    } else {
      return res
        .status(400)
        .json({ error: "Impossible de trouver l'utilisateur" })
    }
  }

  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
