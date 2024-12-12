const { Schema, model } = require("mongoose")

const companySchema = new Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        logo: {
            type: String
        },
        categories: {
            type: Array
        },
        phone: {
            type: String,
        },
        address: {
            type: Array
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

const Company = model("Company", companySchema)

module.exports = Company