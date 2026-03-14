import { IoClose } from 'react-icons/io5'
import { Button } from '@/components/ui/button'

interface CartDrawerHeaderProps {
  itemCount: number
  onClose: () => void
}

export function CartDrawerHeader({ itemCount, onClose }: CartDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2">
        <span>Mi Carrito</span>
        {itemCount > 0 && (
          <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        )}
      </h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="rounded-full hover:rotate-90 transition-transform duration-300"
        aria-label="Cerrar carrito de compras"
      >
        <IoClose size={20} className="text-muted-foreground" />
      </Button>
    </div>
  )
}
