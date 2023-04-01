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

  if (session?.user?.email && req.method === 'POST') {
    const currentUser = await uService.getUserAppByEmail(session.user.email)
    const { newTask }: { newTask: string | null } = JSON.parse(req.body)

    if (currentUser && newTask && !currentUser.taches.includes(newTask)) {
      const newTaches: string[] = [...currentUser.taches, newTask]
      const updatedUser = { ...currentUser, taches: newTaches }
      const newUser = await uService.updateUserApp(updatedUser)
      if (newUser) {
        return res.status(201).json({ taches: newUser.taches })
      } else {
        return res
          .status(400)
          .json({ message: 'echec de la mise a jour des taches' })
      }
    } else {
      return res.status(400).json({ message: 'Il manque des informations' })
    }
  } else {
    return res.status(400).json({ message: 'Impossible dans ces conditions' })
  }
}
