import { ChangeEvent } from "react";
import {
  ICardInfo,
  IValidationErrors,
} from "@/features/checkout/application/types";
import { HiOutlineExclamationCircle, HiOutlineCreditCard, HiOutlineUser } from "react-icons/hi2";
import CardTypeIndicator from "./CardTypeIndicator";
import { useLogLifecycle } from "@/shared/hooks";

interface ICardFormProps {
  cardInfo: ICardInfo;
  errors: IValidationErrors;
  cardType: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CardForm = ({ cardInfo, errors, cardType, onChange }: ICardFormProps) => {
  useLogLifecycle("CardForm");
  return (
    <form className="space-y-4" aria-label="Información de tarjeta">
      {/* Card Number */}
      <div>
        <label htmlFor="card-number" className="block text-sm font-medium mb-1.5">
          Número de tarjeta
        </label>
        <div className="relative">
          <input
            id="card-number"
            placeholder="1234 5678 9012 3456"
            className="w-full px-3 py-2.5 pl-10 rounded-lg border border-border bg-background text-sm font-mono"
            name="number"
            value={cardInfo.number}
            onChange={onChange}
            maxLength={19}
            aria-invalid={!!errors.number}
          />
          <HiOutlineCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CardTypeIndicator cardType={cardType} />
          </div>
        </div>
        {errors.number && (
          <p className="text-destructive text-xs mt-1 flex items-center gap-1">
            <HiOutlineExclamationCircle className="w-3 h-3" />
            {errors.number}
          </p>
        )}
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="card-name" className="block text-sm font-medium mb-1.5">
          Nombre del titular
        </label>
        <div className="relative">
          <input
            id="card-name"
            placeholder="Juan Pérez"
            className="w-full px-3 py-2.5 pl-10 rounded-lg border border-border bg-background text-sm"
            name="name"
            value={cardInfo.name}
            onChange={onChange}
            aria-invalid={!!errors.name}
          />
          <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        {errors.name && (
          <p className="text-destructive text-xs mt-1 flex items-center gap-1">
            <HiOutlineExclamationCircle className="w-3 h-3" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="card-expiry" className="block text-sm font-medium mb-1.5">
            Vencimiento
          </label>
          <input
            id="card-expiry"
            placeholder="MM/YY"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-mono"
            name="expiry"
            value={cardInfo.expiry}
            onChange={onChange}
            maxLength={5}
            aria-invalid={!!errors.expiry}
          />
          {errors.expiry && (
            <p className="text-destructive text-xs mt-1 flex items-center gap-1">
              <HiOutlineExclamationCircle className="w-3 h-3" />
              {errors.expiry}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="card-cvc" className="block text-sm font-medium mb-1.5">
            CVC
          </label>
          <input
            id="card-cvc"
            placeholder="123"
            type="password"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-mono"
            name="cvc"
            value={cardInfo.cvc}
            onChange={onChange}
            maxLength={4}
            aria-invalid={!!errors.cvc}
          />
          {errors.cvc && (
            <p className="text-destructive text-xs mt-1 flex items-center gap-1">
              <HiOutlineExclamationCircle className="w-3 h-3" />
              {errors.cvc}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default CardForm;
