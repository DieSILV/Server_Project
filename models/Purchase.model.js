const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending'
        },
        total: {
            type: Number,
            required: true,
            default: 0
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }
    },
    { timestamps: true }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
