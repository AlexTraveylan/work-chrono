import { useState } from 'react'
import { AffTestTask } from '../testdata/models/AffTestTask'

export function AreaPlanning({
  taskOrpause,
  sizeElem,
  begin,
}: {
  sizeElem: number
  begin: number
  taskOrpause: AffTestTask
}) {
  const [isShow, setIsShow] = useState(false)

  return (
    <div
      style={{ height: `${sizeElem}%`, top: `${begin}%` }}
      onClick={() => setIsShow(true)}
      className={`absolute cursor-pointer   ${
        taskOrpause.label === 'Pause' ? 'bg-slate-50' : 'bg-lime-400'
      } w-[90%] left-[5%] rounded text-center border border-solid border-cyan-900 truncate flex justify-center items-center z-20 hover:border-2`}
    >
      {taskOrpause.label}
      {/* <>
        <DetailTaskOrPause
          isShow={isShow}
          setIsShow={setIsShow}
          taskOrpause={taskOrpause}
        />
      </> */}
    </div>
  )
}
