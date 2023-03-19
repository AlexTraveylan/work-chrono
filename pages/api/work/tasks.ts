import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import { TaskSession } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { TaskSessionService } from '../../../prisma/services/task-session-service'

// Handler pour gérer les requêtes API pour créer une nouvelle tâche
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
    // Vérifier si la méthode de requête est POST
    if (req.method === 'POST') {
      // Extraire les données de la requête
      const { taskName } = JSON.parse(req.body)
      const startedAt = new Date()
      const userEmail = session.user.email

      try {
        // Récupérer la session actuelle pour l'utilisateur
        const currentDaySession = await dService.getLastDaySessionForUserToday(
          userEmail
        )

        if (currentDaySession && currentDaySession.id) {
          // Créer un nouvel objet TaskSession
          const newTask: Omit<TaskSession, 'id'> = {
            startedAt: startedAt,
            label: taskName,
            daySessionId: currentDaySession.id,
            endedAt: null,
          }

          // Créer la nouvelle tâche en utilisant le service
          const createdTask = await tService.createTaskSession(newTask)

          // Envoyer une réponse avec la tâche créée
          return res.status(201).json(createdTask)
        } else {
          // Gérer les erreurs lors de la récupération de la session
          return res.status(400).json({ error: 'Pas de session trouvé' })
        }
      } catch (e) {
        // Gérer les erreurs lors de la création de la tâche
        console.error(e)
        return res.status(500).json({ error: 'tache non crée' })
      }
    } else {
      // Envoyer une réponse d'erreur si la méthode n'est pas POST
      res.status(400).json({ message: 'Seule le verbe post est autorisée' })
    }
  }

  // Envoyer une réponse d'erreur si l'utilisateur n'est pas connecté
  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
