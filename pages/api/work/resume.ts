// Importer les dépendances nécessaires pour protéger une route API
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

// Importer les types nécessaires pour les requêtes et les réponses
import type { NextApiRequest, NextApiResponse } from 'next'
// Importer le service DaySession pour interagir avec la base de données
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { PauseService } from '../../../prisma/services/pause-service'
import { TaskSessionService } from '../../../prisma/services/task-session-service'

// Exporter la fonction handler pour gérer les requêtes et les réponses
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Récupérer la session en cours à partir de la requête
  const session = await getServerSession(req, res, authOptions)
  // Instancier le service DaySession
  const dService = new DaySessionService()
  // Instancier le service TaskSession
  const tService = new TaskSessionService()
  // Instancier le service Pause
  const pService = new PauseService()

  // Vérifier si l'utilisateur possède un email
  if (session?.user?.email) {
    // On vérifie qu'une session n'a pas déjà été validé aujourd'hui
    const todayEndedDaySession = await dService.getEndedDaySessionForUserToday(
      session.user.email
    )
    // Si une session validée est trouvée, renvoie une erreur
    if (todayEndedDaySession) {
      return res
        .status(401)
        .json({ error: 'une session a deja été validé aujourdhui' })
    }

    // Sinon récupérer la dernière session en cours pour l'utilisateur
    const currentSession = await dService.getLastDaySessionForUserToday(
      session.user.email
    )

    // Si une session est trouvée, renvoyer la session dans la réponse
    if (currentSession?.id) {
      // Cherche si une tache est en cours sur la session
      try {
        const currentTask = await tService.getLastUnendedTaskByDaySessionId(
          currentSession.id
        )
        // Si une tache est en cours sur la session, on la renvoie avec la session
        return res
          .status(200)
          .json({ session: currentSession, task: currentTask })
      } catch (e) {
        // On part avant à la recherche d'une Pause en cours
        try {
          const currentPause = await pService.getLastUnendedPauseByDaySessionId(
            currentSession.id
          )
          // Si une pause est en cours sur la session, on la renvoie avec la session
          return res
            .status(200)
            .json({ session: currentSession, pause: currentPause })
        } catch (e) {
          // Sinon, renvoie juste la session
          return res.status(200).json({ session: currentSession })
        }
      }
    } else {
      // Si aucune session n'est trouvée, renvoyer une erreur 400
      return res.status(400).json({ error: 'aucune session trouvé' })
    }
  }

  // Si l'utilisateur n'est pas connecté, renvoyer une erreur
  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
