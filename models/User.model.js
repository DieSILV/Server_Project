const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    active: {
      type: Boolean
    },
    role: {
      type: String,
      enum: ["ADMIN", "CLIENT", "COMPANY"],
      default: 'CLIENT'
    },
    phone: {
      type: String
    },
    address: {
      city: {
        type: String
      },
      zipcode: {
        type: String
      },
      firstAddress: {
        type: String
      }
    },
    avatar: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const User = model("User", userSchema)

module.exports = User
