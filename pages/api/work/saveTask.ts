import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { TaskSessionService } from '../../../prisma/services/task-session-service'

// Handler pour gérer les requêtes API pour sauvegarder une tâche
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Récupérer la session de l'utilisateur
  const session = await getServerSession(req, res, authOptions)
  const dService = new DaySessionService()
  const tService = new TaskSessionService()

  // Vérifier si l'utilisateur est connecté
  if (session?.user?.email) {
    // Récupérer la session actuelle pour l'utilisateur
    const currentDaySesion = await dService.getLastDaySessionForUserToday(
      session.user.email
    )

    if (currentDaySesion?.id) {
      try {
        // Récupérer la tâche en cours pour la session actuelle
        const currentTask = await tService.getLastUnendedTaskByDaySessionId(
          currentDaySesion.id
        )

        // Mettre à jour la tâche avec la date de fin
        await tService.updateTaskSession({
          ...currentTask,
          endedAt: new Date(),
        })

        // Envoyer une réponse avec un message de succès
        return res
          .status(200)
          .json({ message: 'Tache sauvegardée avec succes' })
      } catch (err) {
        // Gérer les erreurs lors de la récupération de la tâche
        return res.status(200).json({ error: 'Aucune tache trouvée' })
      }
    } else {
      // Gérer les erreurs lors de la récupération de la session
      return res.status(400).json({ error: 'Session non trouvée' })
    }
  }

  // Envoyer une réponse d'erreur si l'utilisateur n'est pas connecté
  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
