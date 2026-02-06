// src/components/common/Loader.tsx
import React from "react"; // Not strictly needed for this component, but good practice for JSX

const Loader: React.FC = () => {
    return (
        <div className="loader">
            <div className="loader__spinner">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        </div>
    );
};

export default Loader;