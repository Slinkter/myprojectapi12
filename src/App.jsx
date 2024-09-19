import { useEffect, useState } from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";

import Products from "./component/Products";

const App = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [disableButton, setDisableButton] = useState(false);

    const getData = async () => {
        console.log("Fetching data..."); // Debug: Ver cuántas veces se llama a getData()
        try {
            setLoading(true);
            const countSkip = count * 20;
            const url_api = `https://dummyjson.com/products?limit=20&skip=${countSkip}`;
            const res = await fetch(url_api);
            const data = await res.json();
            if (data && data.products && data.products.length) {
                // Añadir nuevos productos
                if (count === 0) {
                    setProducts(data.products);
                } else {
                    setProducts((prevData) => [...prevData, ...data.products]);
                }
                console.log("Updated products:", [
                    ...products,
                    ...data.products,
                ]); // Debug: Ver cuántos productos hay
            }
        } catch (error) {
            setError(true);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 1000);
    }, [count]);

    useEffect(() => {
        if (products.length >= 100) {
            setDisableButton(true);
        }
    }, [products]);

    return (
        <div className="min-h-dvh flex flex-col gap-4 py-8 justify-center items-center bg-gray-200 ">
            {loading ? (
                <>
                    <Spinner className="h-12 w-12" />
                    <p>Loading ...</p>
                </>
            ) : (
                <span>-</span>
            )}
            <>
                {/* Renderiza los productos */}
                {products && products.length > 0 && (
                    <>
                        <Typography variant="h1" color="blue-gray">
                            Lista de Productos
                        </Typography>
                        <Typography variant="lead" color="blue-gray">
                            + React VITE + Tailwind CSS + DummyJSON
                        </Typography>
                        <Products products={products} />
                        <Button
                            className="w-96"
                            variant="outlined"
                            disabled={disableButton}
                            onClick={() => setCount(count + 1)}
                        >
                            Ver más
                        </Button>
                        {disableButton ? (
                            <p>Has alcanzado los 100 productos</p>
                        ) : null}
                    </>
                )}
            </>
        </div>
    );
};

export default App;
