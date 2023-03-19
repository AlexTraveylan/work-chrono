import { Pause } from '@prisma/client'
import { prisma } from './prisma-client'

export class PauseService {
  async createPause({ startedAt, daySessionId }: Omit<Pause, 'id'>) {
    const pause = await prisma.pause.create({
      data: {
        startedAt,
        daySessionId,
      },
    })
    return pause
  }

  async updatePause({ id, startedAt, endedAt, daySessionId }: Pause) {
    const pause = await prisma.pause.update({
      where: {
        id,
      },
      data: {
        startedAt,
        endedAt,
        daySessionId,
      },
    })
    return pause
  }

  async deletePause(id: number) {
    const pause = await prisma.pause.delete({
      where: {
        id,
      },
    })
    return pause
  }

  async getPauseById(id: number) {
    const pause = await prisma.pause.findUnique({
      where: {
        id,
      },
    })
    return pause
  }

  async getAllPauses() {
    const pauses = await prisma.pause.findMany()
    return pauses
  }

  async getLastUnendedPauseByDaySessionId(daySessionId: number) {
    const pause = await prisma.pause.findFirst({
      where: {
        daySessionId: daySessionId,
        endedAt: null,
      },
      orderBy: {
        startedAt: 'desc',
      },
    })

    if (!pause) {
      throw new Error('No unended pause found for the given daySessionId')
    }

    return pause
  }

  async getAllPausesByDaySessionId(daySessionId: number) {
    const pauses = await prisma.pause.findMany({
      where: {
        daySessionId: daySessionId,
      },
    })
    return pauses
  }
}
