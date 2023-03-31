import { TaskSession } from '@prisma/client'
import { prisma } from './prisma-client'

export class TaskSessionService {
  async createTaskSession({
    startedAt,
    label,
    daySessionId,
  }: Omit<TaskSession, 'id'>) {
    if (!daySessionId) {
      throw new Error('daySessionId is required')
    }

    const taskSession = await prisma.taskSession.create({
      data: {
        startedAt,
        label,
        daySession: {
          connect: {
            id: daySessionId,
          },
        },
      },
    })
    return taskSession
  }

  async updateTaskSession({
    id,
    startedAt,
    label,
    endedAt,
    daySessionId,
  }: TaskSession) {
    const taskSession = await prisma.taskSession.update({
      where: {
        id,
      },
      data: {
        startedAt,
        label,
        endedAt,
        daySessionId,
      },
    })
    return taskSession
  }

  async deleteTaskSession(id: number) {
    const taskSession = await prisma.taskSession.delete({
      where: {
        id,
      },
    })
    return taskSession
  }

  async getTaskSessionById(id: number) {
    const taskSession = await prisma.taskSession.findUnique({
      where: {
        id,
      },
    })
    return taskSession
  }

  async getAllTaskSessions() {
    const taskSessions = await prisma.taskSession.findMany()
    return taskSessions
  }

  async getAllTaskSessionsForDaySession(daySessionId: number) {
    const taskSessions = await prisma.taskSession.findMany({
      where: {
        daySessionId,
      },
    })
    return taskSessions
  }

  async deleteUnendedTaskSessionsByDaySessionId(daySessionId: number) {
    const deletedTaskSessions = await prisma.taskSession.deleteMany({
      where: {
        daySessionId: daySessionId,
        endedAt: null,
      },
    })
    return deletedTaskSessions
  }

  async deleteAllNullEndedTaskSessionsByEmail(userEmail: string) {
    const user = await prisma.userApp.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
      },
    })

    if (!user) {
      throw new Error(`No user found with email: ${userEmail}`)
    }

    const deletedTaskSessions = await prisma.taskSession.deleteMany({
      where: {
        OR: [
          {
            daySession: {
              userId: user.id,
            },
            endedAt: null,
          },
          {
            daySessionId: null,
          },
        ],
      },
    })

    return deletedTaskSessions
  }

  async getLastUnendedTaskByDaySessionId(
    daySessionId: number
  ): Promise<TaskSession> {
    const taskSession = await prisma.taskSession.findFirst({
      where: {
        daySessionId: daySessionId,
        endedAt: null,
      },
      orderBy: {
        startedAt: 'desc',
      },
    })

    if (!taskSession) {
      throw new Error('Aucun TaskSession correspondant trouvé.')
    }

    return taskSession
  }
}
