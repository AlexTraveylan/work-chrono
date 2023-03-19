// Importation des bibliothèques nécessaires
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { TaskSessionService } from '../../../prisma/services/task-session-service'

// Handler pour la route protégée de l'API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Récupération de la session utilisateur
  const session = await getServerSession(req, res, authOptions)

  // Initialisation des services
  const dService = new DaySessionService()
  const tService = new TaskSessionService()

  // Vérification si l'utilisateur est connecté
  if (session?.user?.email) {
    // Récupération de la session en cours pour l'utilisateur
    const currentDaySession = await dService.getLastDaySessionForUserToday(
      session.user.email
    )

    // Si une session est trouvée
    if (currentDaySession?.id) {
      // Suppression des TaskSession non terminées pour la session en cours
      await tService.deleteUnendedTaskSessionsByDaySessionId(
        currentDaySession.id
      )

      // Envoi de la réponse de succès
      return res.status(200).json({ message: 'Tache annulée avec succes' })
    } else {
      // Envoi de l'erreur si aucune session trouvée
      return res.status(400).json({ error: 'Aucune session trouvée' })
    }
  }

  // Envoi de l'erreur si l'utilisateur n'est pas connecté
  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
