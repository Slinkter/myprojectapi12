import { useState, useCallback } from 'react'
import { HiOutlineSearch, HiOutlineXMark } from 'react-icons/hi2'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar productos...',
  className,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = useCallback(() => {
    onChange('')
  }, [onChange])

  return (
    <div
      className={cn(
        'relative flex items-center transition-all duration-200',
        isFocused && 'ring-2 ring-amber-500/50',
        className
      )}
    >
      <HiOutlineSearch
        className={cn(
          'absolute left-4 w-5 h-5 transition-colors',
          isFocused ? 'text-amber-600' : 'text-slate-400'
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full h-12 pl-12 pr-12 rounded-xl',
          'bg-slate-50 dark:bg-slate-900/50',
          'border border-slate-200 dark:border-slate-800',
          'text-slate-700 dark:text-slate-300',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-0',
          'transition-all duration-200'
        )}
        aria-label="Buscar productos"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-2 h-8 w-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          aria-label="Limpiar búsqueda"
        >
          <HiOutlineXMark className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
