/**
 * @file Loader
 * @architecture Presentation layer - loading spinner component
 * @side-effects None - pure UI component
 * @perf CSS animation via Tailwind (GPU-accelerated)
 */
const Loader = () => {
    return (
        <div className="loader">
            <div className="loader__spinner">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        </div>
    );
};

export default Loader;
