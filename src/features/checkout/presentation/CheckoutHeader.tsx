import { Link } from "react-router-dom";
import { IoArrowBack, IoShieldCheckmarkOutline } from "react-icons/io5";

const CheckoutHeader = () => {
  return (
    <div className="p-8 border-b border-border bg-background/50">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <IoArrowBack className="w-4 h-4" /> Volver a la Tienda
        </Link>
        <div className="flex items-center gap-2 text-success text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-success/10 rounded-full border border-success/30">
          <IoShieldCheckmarkOutline className="w-3.5 h-3.5" />
          Pago Seguro
        </div>
      </div>
      <h1
        id="checkout-title"
        className="text-3xl font-extrabold text-foreground tracking-tight"
      >
        Detalles de Pago
      </h1>
      <p className="text-muted-foreground mt-2 font-medium">
        Tu pago será procesado de forma segura y encriptada.
      </p>
    </div>
  );
};

export default CheckoutHeader;
