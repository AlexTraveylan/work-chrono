// This is an example of to protect an API route
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const dService = new DaySessionService()

  if (session?.user?.email) {
    const testRecupSession = await dService.getLastDaySessionForUserToday(
      session.user.email
    )

    if (testRecupSession) {
      return res.status(200).json({ message: 'Il y a une session en cours' })
    } else {
      return res.status(400).json({ erreur: 'Pas de session en cours' })
    }
  }

  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
