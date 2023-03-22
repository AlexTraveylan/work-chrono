import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { PauseService } from '../../../prisma/services/pause-service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const pService = new PauseService()

  if (session && req.method === 'POST') {
    const { daySessionId } = JSON.parse(req.body)
    const pauses = await pService.getAllPausesByDaySessionId(daySessionId)

    if (pauses) {
      return res.status(200).json({ pauses })
    } else {
      return res.status(400).json({ error: 'Pauses non trouvées' })
    }
  }

  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
