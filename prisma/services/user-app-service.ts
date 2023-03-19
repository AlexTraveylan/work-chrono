import { UserApp } from '@prisma/client'
import { prisma } from './prisma-client'

export class UserAppService {
  async createUserApp({ name, email, taches }: Omit<UserApp, 'id'>) {
    const userApp = await prisma.userApp.create({
      data: {
        name,
        email,
        taches,
      },
    })
    return userApp
  }

  async updateUserApp({ id, name, email, taches }: UserApp) {
    const userApp = await prisma.userApp.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        taches,
      },
    })
    return userApp
  }

  async deleteUserApp(id: number) {
    const userApp = await prisma.userApp.delete({
      where: {
        id,
      },
    })
    return userApp
  }

  async getUserAppById(id: number) {
    const userApp = await prisma.userApp.findUnique({
      where: {
        id,
      },
    })
    return userApp
  }

  async getAllUserApps() {
    const userApps = await prisma.userApp.findMany()
    return userApps
  }

  async getUserAppByEmail(email: string) {
    const userApp = await prisma.userApp.findUnique({
      where: {
        email,
      },
    })
    return userApp
  }
}
