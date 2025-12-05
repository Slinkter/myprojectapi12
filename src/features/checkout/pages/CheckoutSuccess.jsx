import { Link } from "react-router-dom";
import { Button, Card, Typography } from "@material-tailwind/react";

const CheckoutSuccess = () => {
  return (
    <div className="checkout-success-page">
      <Card className="checkout-success-card">
        <Typography
          variant="h4"
          color="green"
          className="checkout-success-card__title"
        >
          Payment Successful!
        </Typography>
        <Typography className="checkout-success-card__message">
          Thank you for your purchase.
        </Typography>
        <Link to="/">
          <Button variant="gradient" color="blue">
            Continue Shopping
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
