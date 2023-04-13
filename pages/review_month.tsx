import { DaySession, Pause, TaskSession } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import Layout from '../components/layout'
import { ReviewWeekCard } from '../components/review_week_card'
import { ButtonApp } from '../components/shared/buttonApp'
import { Loader } from '../components/shared/loader'
import { ReturnButton } from '../components/shared/return'
import { generateMonthlyReportPdf } from '../components/utils/pdfbuilder'
import { WeekReview } from './api/reviews/monthReview'

type WeekReviewAPI = {
  daysSessions: {
    id: number
    startedAt: string
    endedAt: string
    userId: number
  }[]
  pausesSessions: {
    id: number
    startedAt: string
    endedAt: string
    daySessionId: number
  }[]
  tasksSessions: {
    id: number
    startedAt: string
    label: string
    endedAt: string
    daySessionId: number
  }[]
}

export default function ReviewMonth() {
  const { data: session } = useSession()
  const [weekSessions, setWeekSessions] = useState<WeekReview[]>([])
  const [totalMonth, setTotalMonth] = useState<WeekReview>({
    daysSessions: [],
    pausesSessions: [],
    tasksSessions: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [nb_month_back, setNb_month_back] = useState(0)

  async function fetchDaySession() {
    setIsLoading(true)
    const current_nb_month_back = nb_month_back
    const response = await fetch(`/api/reviews/monthReview`, {
      method: 'POST',
      body: JSON.stringify({ nb_month_back: nb_month_back }),
    })

    // initialisation des objets a remplir
    const weekSessionsTemp: WeekReview[] = []
    const totalMonthTemp: WeekReview = {
      daysSessions: [],
      pausesSessions: [],
      tasksSessions: [],
    }

    if (response.ok) {
      const data: WeekReviewAPI[] = await response.json()

      for (const datum of data) {
        const currentWeekDaySessions: DaySession[] = datum.daysSessions
          .filter((data) => data.endedAt && data.endedAt > data.startedAt)
          .map((day) => {
            return {
              id: day.id,
              startedAt: new Date(day.startedAt),
              endedAt: new Date(day.endedAt),
              userId: day.userId,
            }
          })

        const currentWeekPausesSessions: Pause[] = datum.pausesSessions
          .filter((data) => data.endedAt && data.endedAt > data.startedAt)
          .map((pause) => {
            return {
              id: pause.id,
              startedAt: new Date(pause.startedAt),
              endedAt: new Date(pause.endedAt),
              daySessionId: pause.daySessionId,
            }
          })

        const currentWeekTaskSessions: TaskSession[] = datum.tasksSessions
          .filter((data) => data.endedAt && data.endedAt > data.startedAt)
          .map((task) => {
            return {
              id: task.id,
              startedAt: new Date(task.startedAt),
              label: task.label,
              endedAt: new Date(task.endedAt),
              daySessionId: task.daySessionId,
            }
          })

        const currentWeekReview: WeekReview = {
          daysSessions: currentWeekDaySessions,
          pausesSessions: currentWeekPausesSessions,
          tasksSessions: currentWeekTaskSessions,
        }

        weekSessionsTemp.push(currentWeekReview)

        totalMonthTemp.daysSessions.push(...currentWeekReview.daysSessions)
        totalMonthTemp.pausesSessions.push(...currentWeekReview.pausesSessions)
        totalMonthTemp.tasksSessions.push(...currentWeekReview.tasksSessions)
      }
      setWeekSessions(weekSessionsTemp)
      setTotalMonth(totalMonthTemp)
      setNb_month_back(current_nb_month_back)
    }
    setIsLoading(false)
  }

  function downloadMonthlyReport(
    weekReview: WeekReview,
    weekSessions: WeekReview[]
  ) {
    if (session) {
      const pdfDoc = generateMonthlyReportPdf(weekReview, weekSessions, session)
      pdfDoc.save('bilan-du-mois.pdf')
    }
  }

  useEffect(() => {
    setTotalMonth({
      daysSessions: [],
      pausesSessions: [],
      tasksSessions: [],
    })
    setWeekSessions([])
    fetchDaySession()
  }, [nb_month_back])

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <ReturnButton path="/" />
      <div className="flex flex-row gap-3 my-3">
        <div onClick={() => setNb_month_back(2)}>
          <ButtonApp>2</ButtonApp>
        </div>
        <div onClick={() => setNb_month_back(1)}>
          <ButtonApp>1</ButtonApp>
        </div>
        <div onClick={() => setNb_month_back(0)}>
          <ButtonApp>0</ButtonApp>
        </div>
      </div>
      {totalMonth && totalMonth.daysSessions.length > 1 && (
        <div className="my-3 flex flex-col gap-3 items-center">
          <h1 className="text-4xl text-center font-semibold text-purple-800">
            Bilan du{' '}
            {nb_month_back === 0 ? (
              <span>mois en cours</span>
            ) : (
              <>
                {nb_month_back === 1 ? (
                  <span>mois précédent</span>
                ) : (
                  <span>mois antépénultième</span>
                )}
              </>
            )}
          </h1>
          <ReviewWeekCard
            key={-1}
            daysSession={totalMonth.daysSessions}
            pausesSession={totalMonth.pausesSessions}
            tasksSession={totalMonth.tasksSessions}
          />
          <div onClick={() => downloadMonthlyReport(totalMonth, weekSessions)}>
            <ButtonApp>Télécharger le bilan en pdf</ButtonApp>
          </div>
        </div>
      )}

      <div className="my-3 min-h-[70vh]">
        {weekSessions.length > 0 ? (
          <>
            <h1 className="text-4xl text-center font-semibold text-purple-800">
              Bilan par semaines
            </h1>
            <div className="flex flex-row justify-center gap-3 my-3 flex-wrap">
              {weekSessions.map((week) => {
                if (week.daysSessions.length > 0) {
                  return (
                    <ReviewWeekCard
                      key={week.daysSessions[0].id}
                      daysSession={week.daysSessions}
                      pausesSession={week.pausesSessions}
                      tasksSession={week.tasksSessions}
                    />
                  )
                }
              })}
            </div>
          </>
        ) : (
          <>
            {isLoading ? (
              <Loader show={isLoading} />
            ) : (
              <div>Aucune donnée trouvée ce mois 🤷‍♂️</div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
