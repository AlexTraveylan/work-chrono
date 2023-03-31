// Importer les dépendances nécessaires
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

// Importer les types nécessaires pour les requêtes et les réponses
import type { NextApiRequest, NextApiResponse } from 'next'
// Importer le service DaySession pour interagir avec la base de données
import { DaySessionService } from '../../../prisma/services/day-session-service'

// Exporter la fonction handler pour gérer les requêtes et les réponses
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Récupérer la session en cours à partir de la requête
  const session = await getServerSession(req, res, authOptions)
  // Instancier le service DaySession
  const dService = new DaySessionService()

  // Vérifier si l'utilisateur est connecté et possède un email
  if (session?.user?.email) {
    // Récupérer la dernière session en cours pour l'utilisateur
    const currentDaySession = await dService.getLastDaySessionForUserToday(
      session.user.email
    )
    // Si une session est trouvée
    if (currentDaySession) {
      // Mettre à jour la session avec l'heure de fin
      const endedAt = new Date()
      await dService.updateDaySession({
        ...currentDaySession,
        endedAt: endedAt,
      })

      // Définir le message pour les opérations de base de données
      const message = 'La session a bien été enregistré'

      // Envoyer une réponse avec les messages et l'heure de fin
      return res.status(200).json({ endedAt: endedAt, message: message })
    } else {
      // Si aucune session n'est trouvée, envoyer une erreur 404
      return res.status(404).json({ error: 'Pas de session trouvé' })
    }
  }

  // Si l'utilisateur n'est pas connecté, envoyer une erreur
  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
