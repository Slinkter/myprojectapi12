import { IoCartOutline } from 'react-icons/io5'
import { EmptyState } from '@/components/common/EmptyState'

interface CartEmptyStateProps {
  onContinueShopping: () => void
}

export function CartEmptyState({ onContinueShopping }: CartEmptyStateProps) {
  return (
    <EmptyState
      icon={<IoCartOutline className="w-10 h-10" />}
      title="Tu carrito está vacío"
      description="Añade productos para comenzar a comprar"
      actionLabel="Seguir comprando"
      onAction={onContinueShopping}
      className="min-h-[300px]"
    />
  )
}
