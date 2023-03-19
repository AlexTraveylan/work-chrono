import { FakeDay } from './FakeDate'
import { fakePause } from './fakePause'
import { FakeWorkSession } from './fakeWorkSession'

export class FakeDaySession {
  id!: number
  day!: FakeDay
  started_at!: number
  work_sessions?: FakeWorkSession[]
  pauses?: fakePause[]
  ended_at?: number
}
