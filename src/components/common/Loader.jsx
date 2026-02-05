/**
 * @file Loader
 * @architecture Capa de presentación - componente spinner de carga
 * @side-effects Ninguno - componente de UI puro
 * @perf Animación CSS a través de Tailwind (acelerado por GPU)
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
