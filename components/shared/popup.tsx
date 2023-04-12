import { Dispatch, SetStateAction } from 'react'
import { AffTestTask } from '../../testdata/models/AffTestTask'
import {
  formatOneorTwoDigitOnToTwoDigits,
  get_hour_minute_from_timeStamp,
} from './format'

export function DetailTaskOrPause({
  taskOrpause,
  isShow,
  setIsShow,
}: {
  taskOrpause: AffTestTask
  isShow: boolean
  setIsShow: Dispatch<SetStateAction<boolean>>
}) {
  function handleClose() {
    setIsShow(false)
  }

  const debut = get_hour_minute_from_timeStamp(
    new Date(taskOrpause.startedAt).getTime()
  )
  const debutFormated = `${debut.hour}h${formatOneorTwoDigitOnToTwoDigits(
    debut.minute
  )}`
  const fin = get_hour_minute_from_timeStamp(
    new Date(taskOrpause.endedAt).getTime()
  )
  const finFormated = `${fin.hour}h${formatOneorTwoDigitOnToTwoDigits(
    fin.minute
  )}`

  return (
    <>
      {isShow && (
        <div className="flex flex-col gap-3 items-center justify-center w-[150px] h-[100px] rounded-md bg-black text-white z-50 fixed top-1/2">
          <h1>{taskOrpause.label}</h1>
          <h2>Début : {debutFormated}</h2>
          <h3>Fin : {finFormated}</h3>
        </div>
      )}
    </>
  )
}
