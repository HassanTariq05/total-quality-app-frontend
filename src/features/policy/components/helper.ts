import { useCallback, useEffect, useState } from 'react'

export const getStatus = (status: string | undefined) => {
  if (status === 'APPROVED') {
    return 'Approved'
  } else if (status === 'SENT_FOR_REVISION') {
    return 'Sent For Revision'
  } else if (status === 'DRAFT') {
    return 'Draft'
  } else if (status === 'SENT_FOR_APPROVAL') {
    return 'Sent For Approval'
  } else if (status === 'REJECTED') {
    return 'Rejected'
  } else if (status === 'ARCHIVED') {
    return 'Archived'
  } else {
    return 'Unknown'
  }
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFsChange = useCallback(() => {
    const fsElement =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement ||
      null
    setIsFullscreen(!!fsElement)
  }, [])

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    document.addEventListener('mozfullscreenchange', handleFsChange)
    document.addEventListener('MSFullscreenChange', handleFsChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
      document.removeEventListener('mozfullscreenchange', handleFsChange)
      document.removeEventListener('MSFullscreenChange', handleFsChange)
    }
  }, [handleFsChange])

  const requestFullscreen = useCallback(async (el?: Element | null) => {
    const target = el || document.documentElement
    if (!target) return false
    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen()
      } else if ((target as any).webkitRequestFullscreen) {
        ;(target as any).webkitRequestFullscreen()
      } else if ((target as any).mozRequestFullScreen) {
        ;(target as any).mozRequestFullScreen()
      } else if ((target as any).msRequestFullscreen) {
        ;(target as any).msRequestFullscreen()
      } else {
        return false
      }
      return true
    } catch (e) {
      return false
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        ;(document as any).msExitFullscreen()
      } else {
        return false
      }
      return true
    } catch (e) {
      return false
    }
  }, [])

  return {
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    setIsFullscreen,
  }
}
