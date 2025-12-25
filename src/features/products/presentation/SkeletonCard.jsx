import { Card, CardBody, CardFooter, CardHeader } from "@material-tailwind/react";

const SkeletonCard = () => {
    return (
        <Card className="w-full max-w-sm mx-auto neumo-card">
            <CardHeader shadow={false} floated={false} className="h-56 rounded-t-xl overflow-hidden">
                <div className="h-full w-full bg-[var(--neumo-shadow-light)] dark:bg-[var(--neumo-shadow-dark-mode-dark)] animate-pulse"></div>
            </CardHeader>
            <CardBody className="p-4">
                <div className="h-6 w-3/4 mb-2 bg-[var(--neumo-shadow-light)] dark:bg-[var(--neumo-shadow-dark-mode-dark)] animate-pulse rounded"></div>
                <div className="h-4 w-full bg-[var(--neumo-shadow-light)] dark:bg-[var(--neumo-shadow-dark-mode-dark)] animate-pulse rounded"></div>
            </CardBody>
            <CardFooter className="p-4">
                <div className="flex justify-between items-center">
                    <div className="h-6 w-1/4 bg-[var(--neumo-shadow-light)] dark:bg-[var(--neumo-shadow-dark-mode-dark)] animate-pulse rounded"></div>
                    <div className="h-8 w-1/4 bg-[var(--neumo-shadow-light)] dark:bg-[var(--neumo-shadow-dark-mode-dark)] animate-pulse rounded"></div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default SkeletonCard;
