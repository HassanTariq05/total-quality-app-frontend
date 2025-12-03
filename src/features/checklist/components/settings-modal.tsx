import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  formWidthValue: number | undefined
  onSave: (formWidth: number | undefined) => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  onSave,
  formWidthValue,
}) => {
  const [formWidth, setFormWidth] = useState<number | undefined>(formWidthValue)

  const handleSave = () => {
    onSave(formWidth)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='bg-background text-foreground sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Configure Checklist</DialogTitle>
        </DialogHeader>

        <div className='space-y-1'>
          <Label htmlFor='form-width'>Form Width</Label>
          <Input
            id='form-width'
            type='number'
            min={1}
            value={formWidth || 1}
            onChange={(e) => setFormWidth(Number(e.target.value))}
            placeholder='e.g. 100'
          />
        </div>

        <DialogFooter className='mt-6'>
          <Button variant='ghost' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
