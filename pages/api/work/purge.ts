// This is an example of to protect an API route
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
  const pService = new PauseService()
  const tService = new TaskSessionService()
  const dService = new DaySessionService()

  if (session?.user?.email) {
    let message1 = 'Aucune pause à purger'
    let message2 = 'Aucune tache à purger'
    let message3 = 'Aucune daySession à purger'

    try {
      pService.deleteAllNullEndedPausesByEmail(session.user.email)
      message1 = 'Pauses non utilisés purgés'
    } catch {
      console.error('echec delete pause')
    }

    try {
      tService.deleteAllNullEndedTaskSessionsByEmail(session.user.email)
      message2 = 'Taches non utilisés purgés'
    } catch {
      console.error('echec delete taches')
    }

    try {
      dService.deleteAllUnendedDaySessionsForUser(session.user.email)
      message3 = 'DaySessions non utilisés purgés'
    } catch {
      console.error('echec delete daysession')
    }

    return res.status(200).json({ message1, message2, message3 })
  }

  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
