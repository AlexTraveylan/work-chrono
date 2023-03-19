import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import { DaySession, UserApp } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { DaySessionService } from '../../../prisma/services/day-session-service'
import { UserAppService } from '../../../prisma/services/user-app-service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Vérifie si la session existe
  const session = await getServerSession(req, res, authOptions)

  // Initialise les services pour accéder à la base de données
  const uService = new UserAppService()
  const dService = new DaySessionService()

  if (session?.user?.email && session?.user?.name) {
    // Initialise la variable userToSend
    let userToSend: UserApp

    if (req.method === 'GET') {
      // Récupère l'utilisateur associé à l'email de la session
      const searchUser = await uService.getUserAppByEmail(session.user.email)
      if (searchUser) {
        // Si l'utilisateur existe, on l'utilise
        userToSend = searchUser

        // On vérifie qu'une session n'a pas déjà été validé aujourd'hui
        const todayEndedDaySession =
          await dService.getEndedDaySessionForUserToday(userToSend.email)
        // Si une session validée et trouvé, renvoie une erreur
        if (todayEndedDaySession) {
          return res
            .status(401)
            .json({ error: 'une session a deja été validé aujourdhui' })
        }
      } else {
        // Sinon, on crée un nouvel utilisateur
        const newUser: Omit<UserApp, 'id'> = {
          name: session.user.name,
          email: session.user.email,
          taches: [],
        }
        userToSend = await uService.createUserApp(newUser)
      }
      // Initialise les variables pour la création d'une nouvelle session
      const day = new Date()

      if (userToSend?.id) {
        // Crée une nouvelle session avec les données initiales
        const newDaySession: Omit<DaySession, 'id'> = {
          startedAt: day,
          userId: userToSend.id,
          endedAt: null,
        }
        const newDay = await dService.createDaySession(newDaySession)

        // Retourne la nouvelle session créée
        return res.status(201).json(newDay)
      } else {
        // Si l'utilisateur n'a pas d'ID, renvoie une erreur
        return res.send({ error: 'Cant find userId' })
      }
    } else {
      // Si la méthode HTTP n'est pas GET, renvoie une erreur
      return res
        .status(400)
        .json({ message: 'echec dans la creation de la session' })
    }
  }

  // Si la session n'existe pas, renvoie une erreur
  res.send({
    error: 'Vous devez être connecté pour acceder à cette page.',
  })
}
