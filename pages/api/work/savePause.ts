// Importation des dépendances
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { PauseService } from '../../../prisma/services/pause-service'

// Fonction de gestionnaire d'API pour mettre fin à la pause en cours
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Récupération de la session serveur
  const session = await getServerSession(req, res, authOptions)
  const dService = new DaySessionService()
  const pService = new PauseService()

  // Vérification de la session utilisateur et de l'email
  if (session?.user?.email) {
    // Récupération de la dernière DaySession pour l'utilisateur
    const currentDaySesion = await dService.getLastDaySessionForUserToday(
      session.user.email
    )

    // Vérification si une DaySession existe
    if (currentDaySesion?.id) {
      // Récupération de la dernière pause non terminée
      try {
        const currentPause = await pService.getLastUnendedPauseByDaySessionId(
          currentDaySesion.id
        )

        // Vérification si une pause existe
        if (currentPause) {
          let message2 = 'Pas de pauses non terminés à supprimer'
          // Mise à jour de la pause avec la date et l'heure actuelles
          await pService.updatePause({ ...currentPause, endedAt: new Date() })

          try {
            pService.deleteAllNullEndedPausesByEmail(session.user.email)
          } catch {
            console.error('echec delete pause')
          }

          // Envoi de la réponse avec succès
          return res.status(200).json({ message: 'Pause sauvegardée' })
        } else {
          // Envoi de la réponse d'erreur si aucune pause n'est trouvée
          return res.status(200).json({ error: 'Aucune pause trouvée' })
        }
      } catch {
        return res.status(200).json({ error: 'Aucune pause en cours' })
      }
    } else {
      // Envoi de la réponse d'erreur si aucune DaySession n'est trouvée
      return res.status(400).json({ error: 'Session non trouvée' })
    }
  }

  // Envoi de la réponse d'erreur si l'utilisateur n'est pas connecté
  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
