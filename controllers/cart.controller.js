const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const mongoose = require('mongoose')


const addToCart = (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ message: `Solo hay ${product.stock} unidades disponibles` });
            }

            return Cart.findOne({ user: userId });
        })
        .then(cart => {
            if (!cart) {
                cart = new Cart({ user: userId, items: [] });
            }

            const existingItem = cart.items.find(item => item.product.toString() === productId);

            if (existingItem) {
                if (existingItem.quantity + quantity > product.stock) {
                    return res.status(400).json({ message: `No puedes agregar más de ${product.stock} unidades en total` });
                }
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            cart.total = cart.items.reduce((sum, item) => sum + item.quantity * product.price, 0);

            return cart.save();
        })
        .then(cart => {
            res.status(200).json({ message: 'Producto agregado al carrito', cart });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error al agregar producto al carrito' });
        });
};

const getCartById = (req, res) => {
    const userId = req.user._id;

    Cart.findOne({ user: userId })
        .populate('items.product')
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const total = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

            res.status(200).json({ cart, total });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener el carrito' });
        });
};

const removeFromCart = (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    Cart.findOne({ user: userId })
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            cart.items = cart.items.filter(item => item.product.toString() !== productId);

            cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

            return cart.save();
        })
        .then(cart => {
            res.status(200).json({ message: 'Producto eliminado del carrito', cart });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar producto del carrito' });
        });
};

const clearCart = (req, res) => {
    const userId = req.user._id;

    Cart.findOne({ user: userId })
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            cart.items = [];
            cart.total = 0;

            return cart.save();
        })
        .then(cart => {
            res.status(200).json({ message: 'Carrito vaciado', cart });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error al vaciar el carrito' });
        });



};
const checkoutCart = async (req, res) => {
    const { cart } = req.body;
    const { _id: userId } = req.payload;

    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío' });
    }

    try {
        const productIds = cart.items.map(item => item.product);
        const products = await Product.find({ '_id': { $in: productIds } });

        const updatedItems = cart.items.map(item => {
            const product = products.find(p => p._id.toString() === item.product.toString());
            if (product) {
                const subtotal = item.quantity * product.price;
                return {
                    ...item,
                    price: product.price,
                    subtotal
                };
            } else {
                return item;
            }
        });

        const total = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);

        const newCart = new Cart({
            user: userId,
            items: updatedItems,
            total: total,
            status: 'pending',
        });

        const savedCart = await newCart.save();
        res.status(201).json(savedCart);

    } catch (err) {
        res.status(500).json({ message: 'Error al guardar el carrito', error: err });
    }
};

const getCartByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const carts = await Cart.find({})
            .populate('items.product') // Populamos productos para acceder a la información completa
            .populate('user', 'firstName lastName'); // Populamos usuario para obtener su nombre
        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: 'No hay carritos disponibles' });
        }
        const filteredCarts = carts.flatMap(cart => {
            const companyProducts = cart.items
                .filter(item => item.product.company.toString() === companyId)
                .map(item => ({
                    cartId: cart._id, // Incluimos el ID del carrito
                    userName: `${cart.user.firstName} ${cart.user.lastName}`,
                    productName: item.product.name,
                    productCategory: item.product.category,
                    price: item.product.price, // Usamos el precio del producto
                    quantity: item.quantity,
                    total: item.product.price * item.quantity, // Calculamos el total
                    createdAt: cart.createdAt,
                    updatedAt: cart.updatedAt
                }));
            return companyProducts.length > 0 ? companyProducts : [];
        });
        if (filteredCarts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para esta compañía' });
        }
        filteredCarts.sort((a, b) => {
            if (a.userName < b.userName) return -1;
            if (a.userName > b.userName) return 1;
            return a.productName.localeCompare(b.productName);
        });
        res.status(200).json(filteredCarts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los carritos' });
    }
};

module.exports = {
    addToCart,
    getCartById,
    removeFromCart,
    checkoutCart,
    clearCart,
    getCartByCompany
};
