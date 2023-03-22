import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { TaskSessionService } from '../../../prisma/services/task-session-service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const tService = new TaskSessionService()

  if (session && req.method === 'POST') {
    const { daySessionId } = JSON.parse(req.body)
    const tasks = await tService.getAllTaskSessionsForDaySession(daySessionId)

    if (tasks) {
      return res.status(200).json({ tasks })
    } else {
      return res.status(400).json({ error: 'Taches non trouvées' })
    }
  }

  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
