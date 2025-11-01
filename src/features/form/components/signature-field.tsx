import React, { useRef, useState, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface SignatureFieldProps {
  value?: string
  onChange: (value: string) => void
}

export const SignatureField: React.FC<SignatureFieldProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false)
  const sigPadRef = useRef<SignatureCanvas | null>(null)
  const [tempSignature, setTempSignature] = useState<string | null>(
    value || null
  )

  // Sync incoming value
  useEffect(() => {
    if (value) setTempSignature(value)
  }, [value])

  const handleSubmitSignature = () => {
    if (sigPadRef.current) {
      const data = sigPadRef.current.toDataURL('image/png')
      setTempSignature(data)
      onChange(data)
    }
    setOpen(false)
  }

  const clearSignature = () => {
    sigPadRef.current?.clear()
  }

  return (
    <div className='flex w-full flex-col gap-2'>
      {tempSignature ? (
        <div className='flex w-full flex-row gap-2'>
          <img
            src={tempSignature}
            alt='Signature'
            onClick={() => setOpen(true)}
            className='border-muted h-[36px] w-[80px] cursor-pointer rounded-md border bg-white object-contain transition hover:opacity-80'
          />
        </div>
      ) : (
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => setOpen(true)}
          className='text-xs'
        >
          Add Signature
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className='bg-background text-foreground sm:max-w-[500px]'
          // ✅ This ensures the canvas is drawn only when dialog is ready
          onOpenAutoFocus={() => {
            if (tempSignature && sigPadRef.current) {
              try {
                sigPadRef.current.fromDataURL(tempSignature)
              } catch (e) {
                console.warn('Error restoring signature:', e)
              }
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {tempSignature ? 'View / Re-sign Signature' : 'Draw Signature'}
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-col items-center gap-4'>
            <SignatureCanvas
              ref={sigPadRef}
              penColor='black'
              backgroundColor='#f9fafb'
              canvasProps={{
                className:
                  'border border-muted rounded-md w-full h-[200px] bg-background',
              }}
            />
            <div className='flex flex-row gap-1'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => {
                  setTempSignature(null)
                  onChange('')
                  setOpen(false)
                }}
                className='text-muted-foreground hover:text-foreground text-xs'
              >
                Remove
              </Button>

              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={clearSignature}
                className='text-muted-foreground hover:text-foreground text-xs'
              >
                Clear
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='ghost'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='button' onClick={handleSubmitSignature}>
              Save Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
