import { DaySession } from '@prisma/client'
import { endOfWeek, isToday, startOfWeek, sub } from 'date-fns'
import { prisma } from './prisma-client'

export class DaySessionService {
  async createDaySession({ startedAt, userId }: Omit<DaySession, 'id'>) {
    const daySession = await prisma.daySession.create({
      data: {
        startedAt,
        userId,
      },
    })
    return daySession
  }

  async updateDaySession({ id, startedAt, endedAt, userId }: DaySession) {
    const daySession = await prisma.daySession.update({
      where: {
        id,
      },
      data: {
        startedAt,
        endedAt,
        userId,
      },
    })
    return daySession
  }

  async deleteDaySession(id: number) {
    const daySession = await prisma.daySession.delete({
      where: {
        id,
      },
    })
    return daySession
  }

  async getDaySessionById(id: number) {
    const daySession = await prisma.daySession.findUnique({
      where: {
        id,
      },
    })
    return daySession
  }

  async getAllDaySessions() {
    const daySessions = await prisma.daySession.findMany()
    return daySessions
  }

  async getAllDaySessionsForUser(userId: number) {
    const daySessions = await prisma.daySession.findMany({
      where: {
        userId,
      },
    })
    return daySessions
  }

  async getAllDaySessionsForUserFor_n_previousWeek(userId: number, n: number) {
    const currentDate = new Date()
    const startOfTargetWeek = startOfWeek(sub(currentDate, { weeks: n }), {
      weekStartsOn: 1,
    })
    const endOfTargetWeek = endOfWeek(sub(currentDate, { weeks: n }), {
      weekStartsOn: 1,
    })

    const daySessions = await prisma.daySession.findMany({
      where: {
        userId,
        startedAt: {
          gte: startOfTargetWeek,
          lt: endOfTargetWeek,
        },
        endedAt: {
          not: null,
          lte: endOfTargetWeek,
        },
      },
    })

    return daySessions
  }

  async getLastDaySessionForUserToday(userEmail: string) {
    const user = await prisma.userApp.findUnique({
      where: {
        email: userEmail,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const daySessions = await prisma.daySession.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startedAt: 'desc',
      },
    })

    const todayDaySession = daySessions.find((daySession) =>
      isToday(daySession.startedAt)
    )

    return todayDaySession
  }

  async deleteAllUnendedDaySessionsForUser(userEmail: string) {
    const user = await prisma.userApp.findUnique({
      where: {
        email: userEmail,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const unendedDaySessions = await prisma.daySession.findMany({
      where: {
        userId: user.id,
        endedAt: null,
      },
    })

    const deletedDaySessions = await Promise.all(
      unendedDaySessions.map(async (daySession) => {
        return await prisma.daySession.delete({
          where: {
            id: daySession.id,
          },
        })
      })
    )

    return deletedDaySessions
  }

  async getEndedDaySessionForUserToday(userEmail: string) {
    const user = await prisma.userApp.findUnique({
      where: {
        email: userEmail,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const daySessions = await prisma.daySession.findMany({
      where: {
        userId: user.id,
        endedAt: {
          not: null, // Rechercher les sessions avec un champ 'endedAt' non null
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    })

    const todayEndedDaySession = daySessions.find((daySession) =>
      isToday(daySession.startedAt)
    )

    return todayEndedDaySession
  }
}
