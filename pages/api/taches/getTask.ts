import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { UserAppService } from '../../../prisma/services/user-app-service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const uService = new UserAppService()

  if (session?.user?.email) {
    const currentUser = await uService.getUserAppByEmail(session.user.email)
    if (currentUser) {
      const taches = currentUser.taches
      return res.status(200).json({ taches: taches })
    } else {
      return res.status(400).json({ message: 'utilisateur non trouvé' })
    }
  }

  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
