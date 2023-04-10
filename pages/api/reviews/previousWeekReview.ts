import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { UserAppService } from '../../../prisma/services/user-app-service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const dService = new DaySessionService()
  const uService = new UserAppService()

  if (session?.user?.email && req.method === 'POST') {
    const { week } = JSON.parse(req.body)
    const currentUser = await uService.getUserAppByEmail(session.user.email)
    if (currentUser?.id) {
      const daysLogged =
        await dService.getAllDaySessionsForUserFor_n_previousWeek(
          currentUser.id,
          week
        )
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
