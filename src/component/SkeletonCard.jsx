import { Card, CardBody, CardFooter, CardHeader } from "@material-tailwind/react";

const SkeletonCard = () => {
    return (
        <Card className="w-full max-w-sm mx-auto bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
            <CardHeader shadow={false} floated={false} className="h-56">
                <div className="h-full w-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            </CardHeader>
            <CardBody className="p-4">
                <div className="h-6 w-3/4 mb-2 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
            </CardBody>
            <CardFooter className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                    <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-8 w-1/4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default SkeletonCard;
