const { Schema, model } = require("mongoose")

const productSchema = new Schema(
    {
        name: {
            type: String
        },
        description: {
            type: String
        },
        cover: {
            type: Array
        },
        price: {
            type: Number
        },
        stock: {
            type: Number
        },
        specs: {
            type: Array
        },
        category: {
            type: String,
            enum: ["electronic", "dormitory", "gaming"]
        },
        subcategory: {
            type: String,
            enum: ["phone", "laptop", "consoles", "computer", "tablets"]
        },
        brand: {
            type: String
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company'
        }
    },
    {
        timestamps: true
    }
)

const Product = model("Product", productSchema)

module.exports = Product