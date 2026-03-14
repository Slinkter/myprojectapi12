import { Link } from "react-router-dom";
import { IoArrowBack, IoShieldCheckmarkOutline } from "react-icons/io5";

const CheckoutHeader = () => {
  return (
    <div className="p-6 border-b border-border">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <IoArrowBack className="w-4 h-4" /> Volver
        </Link>
        <div className="flex items-center gap-1.5 text-success text-xs font-medium px-2.5 py-1 bg-success/10 rounded-full">
          <IoShieldCheckmarkOutline className="w-3.5 h-3.5" />
          Pago Seguro
        </div>
      </div>
      <h1
        id="checkout-title"
        className="text-2xl font-bold text-foreground"
      >
        Checkout
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Completa los datos para realizar tu pago
      </p>
    </div>
  );
};

export default CheckoutHeader;
