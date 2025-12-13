import React from 'react'
import { MaximizeIcon, MinimizeIcon } from 'lucide-react'
import { useFullscreen } from './helper'

type Props = {
  rootRef?: React.RefObject<HTMLElement | null> | null
  onChange?: (isFs: boolean) => void
  setLocalFullScreen?: (v: boolean) => void
}

export const FullScreenButton: React.FC<Props> = ({
  rootRef,
  onChange,
  setLocalFullScreen,
}) => {
  const { isFullscreen, requestFullscreen, exitFullscreen, setIsFullscreen } =
    useFullscreen()

  const toggle = async () => {
    const target = rootRef?.current ?? document.documentElement
    if (!isFullscreen) {
      const ok = await requestFullscreen(target)
      if (!ok) {
        setIsFullscreen(true)
        setLocalFullScreen?.(true)
        onChange?.(true)
      } else {
        setLocalFullScreen?.(true)
        onChange?.(true)
      }
    } else {
      const ok = await exitFullscreen()
      if (!ok) {
        setIsFullscreen(false)
        setLocalFullScreen?.(false)
        onChange?.(false)
      } else {
        setLocalFullScreen?.(false)
        onChange?.(false)
      }
    }
  }

  return (
    <button
      type='button'
      aria-pressed={isFullscreen}
      onClick={toggle}
      className='inline-flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-100'
      title={isFullscreen ? 'Exit full screen' : 'Full screen'}
    >
      {isFullscreen ? (
        <MinimizeIcon className='h-4 w-4' />
      ) : (
        <MaximizeIcon className='h-4 w-4' />
      )}
      <span className='sr-only'>
        {isFullscreen ? 'Exit full screen' : 'Full screen'}
      </span>
    </button>
  )
}
