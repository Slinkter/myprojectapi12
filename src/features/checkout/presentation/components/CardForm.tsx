/**
 * @file CardForm.tsx
 * @description Formulario para ingreso de datos de tarjeta de crédito.
 * Diseño limpio y espaciado con feedback de validación claro.
 * @architecture Presentation Layer - Checkout Components
 */
import { ChangeEvent } from "react";
import { CardInfo, ValidationErrors } from "../../application/types";
import { cn } from "@/lib/utils";

/**
 * @interface CardFormProps
 * @property {CardInfo} cardInfo - Objeto con los datos de la tarjeta
 * @property {ValidationErrors} errors - Objeto con los errores de validación
 * @property {string} cardType - Tipo de tarjeta detectado para mostrar icono
 * @property {function} onChange - Handler para cambios en los inputs
 */
interface CardFormProps {
    cardInfo: CardInfo;
    errors: ValidationErrors;
    cardType: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Componente de formulario para datos de tarjeta.
 * Renderiza inputs controlados para número, nombre, fecha y CVC.
 *
 * @component
 */
const CardForm = ({ cardInfo, errors, cardType, onChange }: CardFormProps) => {
    // Helper para clases de input
    const inputClasses = (hasError: boolean) => cn(
        "w-full px-4 py-3 rounded-xl border bg-(--bg-input) text-(--text-primary) placeholder:text-gray-400 transition-all duration-200 outline-none",
        "focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
        hasError 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/10" 
            : "border-transparent hover:border-(--border-light)"
    );

    return (
        <form
            className={cn("space-y-5 animate-in fade-in slide-in-from-top-4 duration-500")}
            aria-label="Credit card information"
        >
            {/* Card Number */}
            <div className={cn("relative group")}>
                <label htmlFor="card-number" className={cn("block text-xs font-semibold text-(--text-secondary) mb-1.5 uppercase tracking-wider")}>
                    Card Number
                </label>
                <div className="relative">
                    <input
                        id="card-number"
                        placeholder="0000 0000 0000 0000"
                        className={cn(inputClasses(!!errors.number), "font-mono tracking-wider pl-12")}
                        name="number"
                        value={cardInfo.number}
                        onChange={onChange}
                        maxLength={19}
                        aria-invalid={!!errors.number}
                        aria-describedby={errors.number ? "card-number-error" : undefined}
                        autoComplete="cc-number"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    </div>
                    
                    {/* Card Type Icon Indicator */}
                    <div className={cn("absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300", cardType ? "opacity-100" : "opacity-0")}>
                        {cardType === 'visa' && <span className="font-serif italic font-bold text-blue-800 dark:text-blue-400">Visa</span>}
                        {cardType === 'mastercard' && (
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-multiply dark:mix-blend-screen"></div>
                                <div className="w-6 h-6 rounded-full bg-yellow-500/80 mix-blend-multiply dark:mix-blend-screen"></div>
                            </div>
                        )}
                    </div>
                </div>
                {errors.number && (
                    <p id="card-number-error" className={cn("text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium")}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {errors.number}
                    </p>
                )}
            </div>

            {/* Cardholder Name */}
            <div>
                <label htmlFor="cardholder-name" className={cn("block text-xs font-semibold text-(--text-secondary) mb-1.5 uppercase tracking-wider")}>
                    Cardholder Name
                </label>
                <div className="relative">
                    <input
                        id="cardholder-name"
                        placeholder="John Doe"
                        className={cn(inputClasses(!!errors.name), "pl-12")}
                        name="name"
                        value={cardInfo.name}
                        onChange={onChange}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "cardholder-name-error" : undefined}
                        autoComplete="cc-name"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                </div>
                {errors.name && (
                    <p id="cardholder-name-error" className={cn("text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium")}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Expiry and CVC */}
            <div className={cn("grid grid-cols-2 gap-5")}>
                <div>
                    <label htmlFor="card-expiry" className={cn("block text-xs font-semibold text-(--text-secondary) mb-1.5 uppercase tracking-wider")}>
                        Expiry
                    </label>
                    <div className="relative">
                        <input
                            id="card-expiry"
                            placeholder="MM / YY"
                            className={cn(inputClasses(!!errors.expiry), "pl-12 font-mono")}
                            name="expiry"
                            value={cardInfo.expiry}
                            onChange={onChange}
                            maxLength={5}
                            aria-invalid={!!errors.expiry}
                            aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
                            autoComplete="cc-exp"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                    </div>
                    {errors.expiry && (
                        <p id="card-expiry-error" className={cn("text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium")}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {errors.expiry}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="card-cvc" className={cn("block text-xs font-semibold text-(--text-secondary) mb-1.5 uppercase tracking-wider flex items-center justify-between")}>
                        CVC
                        <span className="text-[10px] text-gray-400 normal-case tracking-normal">3 digits</span>
                    </label>
                    <div className="relative">
                        <input
                            id="card-cvc"
                            placeholder="123"
                            className={cn(inputClasses(!!errors.cvc), "pl-12 font-mono")}
                            name="cvc"
                            value={cardInfo.cvc}
                            onChange={onChange}
                            maxLength={4}
                            aria-invalid={!!errors.cvc}
                            aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
                            autoComplete="cc-csc"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                    </div>
                    {errors.cvc && (
                        <p id="card-cvc-error" className={cn("text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium")}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {errors.cvc}
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CardForm;
