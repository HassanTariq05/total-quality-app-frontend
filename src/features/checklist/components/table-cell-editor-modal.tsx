import React, { useState } from 'react'
import { cn } from '@/lib/utils'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CellEditorModalProps {
  open: boolean
  onClose: () => void
  cellType: 'label' | 'field' | 'checkbox' | 'date' | 'signature' | null
  value: string
  identifier?: string
  bg?: string
  placeholder?: string
  alignment?: string
  cellFlex?: number
  onSave: (
    type: 'label' | 'field' | 'checkbox' | 'date' | 'signature',
    value: string,
    identifier: string,
    bg: string,
    placeholder: string,
    alignment: string,
    cellFlex: number
  ) => void
}

const PRESET_COLORS = [
  { name: 'Card', className: 'bg-card/40' },
  { name: 'Primary', className: 'bg-primary/30' },
  { name: 'Destructive', className: 'bg-destructive/30' },
  { name: 'Chart 1', className: 'bg-chart-1/40' },
  { name: 'Chart 2', className: 'bg-chart-2/40' },
  { name: 'Chart 3', className: 'bg-chart-3/40' },
  { name: 'Chart 4', className: 'bg-chart-4/40' },
  { name: 'Chart 5', className: 'bg-chart-5/40' },
]

const ALIGN = [
  { name: 'Left', value: 'left' },
  { name: 'Center', value: 'center' },
  { name: 'Right', value: 'right' },
]

export const CellEditorModal: React.FC<CellEditorModalProps> = ({
  open,
  onClose,
  cellType,
  value,
  identifier,
  onSave,
  bg,
  placeholder,
  alignment,
  cellFlex,
}) => {
  const [selectedType, setSelectedType] = useState<
    'label' | 'field' | 'checkbox' | 'date' | 'signature'
  >(cellType || 'field')
  const [textValue, setTextValue] = useState(value || '')
  const [identifierFieldValue, setIdentifierFieldValue] = useState(
    identifier || ''
  )
  const [cellBg, setCellBg] = useState<string>('')

  const [placeholderCell, setPlaceholderCell] = useState<string>(
    placeholder || ''
  )
  const [alignCell, setAlignCell] = useState<string>(alignment || '')

  const [flex, setFlex] = useState<number>(cellFlex || 1)

  React.useEffect(() => {
    setSelectedType(cellType || 'field')
    setTextValue(value || '')
    setIdentifierFieldValue(identifier || '')
    setCellBg(bg || '')
  }, [cellType, value, open, identifier])

  const handleSave = () => {
    onSave(
      selectedType,
      textValue,
      identifierFieldValue,
      cellBg,
      placeholderCell,
      alignCell,
      flex
    )
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='bg-background text-foreground sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Configure Cell</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Type Selector */}
          <div className='space-y-1'>
            <Label>Select Type</Label>
            <Select
              value={selectedType}
              onValueChange={(val) =>
                setSelectedType(val as 'label' | 'field' | 'checkbox' | 'date')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select cell type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='label'>Label</SelectItem>
                <SelectItem value='field'>Field</SelectItem>
                <SelectItem value='checkbox'>Checkbox</SelectItem>
                <SelectItem value='date'>Date</SelectItem>
                <SelectItem value='signature'>Signature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedType !== 'signature' && (
            <div className='space-y-1'>
              <Label>
                {selectedType === 'label'
                  ? 'Label Text'
                  : selectedType === 'checkbox'
                    ? 'Checkbox Label'
                    : 'Field Placeholder'}
              </Label>

              <Input
                placeholder={
                  selectedType === 'field' ? 'Enter field placeholder' : ''
                }
                value={
                  selectedType === 'field' ? placeholderCell || '' : textValue
                }
                onChange={(e) => {
                  selectedType === 'field'
                    ? setPlaceholderCell(e.target.value)
                    : setTextValue(e.target.value)
                }}
                className='w-full'
              />
            </div>
          )}

          {selectedType !== 'signature' && (
            <div className='space-y-1'>
              <Label>Text Alignment</Label>
              <Select
                value={alignCell}
                onValueChange={(val) => setAlignCell(val)}
              >
                <SelectTrigger className='flex items-center gap-2'>
                  <span className='text-sm'>
                    {ALIGN.find((c) => c.value === alignCell)?.name ||
                      'Select alignment'}
                  </span>
                </SelectTrigger>
                <SelectContent className='grid grid-cols-1 gap-2 p-2'>
                  {ALIGN.map((align) => (
                    <SelectItem
                      key={align.value}
                      value={align.value}
                      className='p-1 text-sm'
                    >
                      {align.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='space-y-1'>
            <Label htmlFor='cell-flex'>Flex (relative width)</Label>
            <Input
              id='cell-flex'
              type='number'
              min={1}
              value={flex || 1}
              onChange={(e) => setFlex(Number(e.target.value))}
              placeholder='e.g. 1, 2, 3'
            />
          </div>

          {selectedType !== 'label' && (
            <div className='space-y-1'>
              <Label htmlFor='cell-identifier'>Identifier</Label>
              <Input
                id='cell-identifier'
                value={identifierFieldValue}
                onChange={(e) => {
                  setIdentifierFieldValue(e.target.value)
                }}
                className='w-full'
                placeholder='property_identifier'
              />
            </div>
          )}

          {/* Background Color Selector as Dropdown */}
          {(selectedType === 'label' ||
            selectedType === 'checkbox' ||
            selectedType === 'field') && (
            <div className='space-y-1'>
              <Label>Background Color</Label>
              <Select value={cellBg} onValueChange={(val) => setCellBg(val)}>
                <SelectTrigger className='flex items-center gap-2'>
                  <div
                    className={cn(
                      'h-6 w-6 rounded border',
                      cellBg || 'bg-muted'
                    )}
                  />
                  <span className='text-sm'>
                    {PRESET_COLORS.find((c) => c.className === cellBg)?.name ||
                      'Select color'}
                  </span>
                </SelectTrigger>
                <SelectContent className='grid grid-cols-3 gap-2 p-2'>
                  {PRESET_COLORS.map((color) => (
                    <SelectItem
                      key={color.name}
                      value={color.className}
                      className='flex items-center gap-2 p-1'
                    >
                      <div
                        className={cn(
                          'h-6 w-6 rounded border',
                          color.className
                        )}
                      />
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
