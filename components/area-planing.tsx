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
        taskOrpause.label === 'Pause'
          ? 'bg-black text-white border-white hover:border-2'
          : 'bg-white border-black hover:border-2'
      } w-[90%] left-[5%] rounded text-center border border-solid  truncate flex justify-center items-center z-20 `}
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
