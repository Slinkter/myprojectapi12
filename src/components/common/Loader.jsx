import { Spinner } from "@material-tailwind/react";

const Loader = () => {
    return (
        <div className="loader">
            <Spinner className="loader__spinner" />
        </div>
    );
};

export default Loader;
