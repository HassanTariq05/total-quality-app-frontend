'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

interface DataTableToolbarWithDebounceProps {
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
}

export const DataTableToolbarWithDebounce = ({
  onSearchChange,
  searchPlaceholder,
}: DataTableToolbarWithDebounceProps) => {
  const [inputValue, setInputValue] = useState('')

  // Debounce updates to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(inputValue)
    }, 500) // 500ms debounce

    return () => clearTimeout(handler)
  }, [inputValue, onSearchChange])

  return (
    <Input
      placeholder={searchPlaceholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className='w-1/4'
    />
  )
}
