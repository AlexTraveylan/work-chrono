import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import { Pause } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { PauseService } from '../../../prisma/services/pause-service'

// Handler pour gérer les requêtes API pour créer une nouvelle pause
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Récupérer la session de l'utilisateur
  const session = await getServerSession(req, res, authOptions)
  const dService = new DaySessionService()
  const pService = new PauseService()

  // Vérifier si l'utilisateur est connecté
  if (session?.user?.email) {
    const userEmail = session.user.email

    // Récupérer la session actuelle pour l'utilisateur
    const currentDaySession = await dService.getLastDaySessionForUserToday(
      userEmail
    )

    // Vérifier si une session a été trouvée
    if (currentDaySession?.id) {
      // Créer un nouvel objet Pause
      const newPause: Omit<Pause, 'id'> = {
        startedAt: new Date(),
        daySessionId: currentDaySession.id,
        endedAt: null,
      }

      // Créer la nouvelle pause en utilisant le service
      const pauseCreated = await pService.createPause(newPause)

      // Envoyer une réponse avec la pause créée
      return res.status(201).json(pauseCreated)
    } else {
      // Gérer les erreurs lors de la récupération de la session
      return res.status(400).json({ error: 'Aucune session trouvée' })
    }
  }

  // Envoyer une réponse d'erreur si l'utilisateur n'est pas connecté
  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
