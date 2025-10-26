import { Link } from 'react-router-dom';
import { Button, Card, Typography } from "@material-tailwind/react";

const CheckoutSuccess = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md p-8 text-center">
                <Typography variant="h4" color="green" className="mb-4">
                    Payment Successful!
                </Typography>
                <Typography className="mb-8">
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
