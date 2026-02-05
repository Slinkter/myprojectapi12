/**
 * Utilidades puras para lógica del carrito.
 */

/**
 * Calcula el precio total del carrito.
 *
 * @param {Array} cart - Items del carrito
 * @returns {number} Precio total
 */
export const calculateTotal = (cart) => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * Agrega un item al carrito o incrementa su cantidad.
 *
 * @param {Array} cart - Carrito actual
 * @param {Object} product - Producto a agregar
 * @param {number} quantity - Cantidad a agregar
 * @returns {Array} Nuevo carrito
 */
export const addItemToCart = (cart, product, quantity) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        return cart.map((item) =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
        );
    }

    return [...cart, { ...product, quantity }];
};

/**
 * Elimina un item del carrito.
 *
 * @param {Array} cart - Carrito actual
 * @param {number} productId - ID del producto a eliminar
 * @returns {Array} Nuevo carrito
 */
export const removeItemFromCart = (cart, productId) => {
    return cart.filter((item) => item.id !== productId);
};

/**
 * Valida si un producto puede ser agregado al carrito.
 *
 * @param {Object} product - Producto a validar
 * @param {number} quantity - Cantidad deseada
 * @returns {Object} Resultado de validación
 */
export const validateCartItem = (product, quantity) => {
    if (!product || !product.id) {
        return { valid: false, error: "Invalid product" };
    }

    if (quantity <= 0) {
        return { valid: false, error: "Quantity must be greater than 0" };
    }

    if (product.stock < quantity) {
        return { valid: false, error: "Insufficient stock" };
    }

    return { valid: true, error: null };
};
