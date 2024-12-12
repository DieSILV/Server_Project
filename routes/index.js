module.exports = app => {
    const productRouter = require("./product.routes")
    app.use("/api", productRouter)

    const authRouter = require("./auth.routes")
    app.use("/api", authRouter)

    const companyRouter = require("./company.routes")
    app.use("/api", companyRouter)

    const userRouter = require("./user.routes")
    app.use("/api", userRouter)

    const cartRouter = require("./cart.routes")
    app.use("/api", cartRouter)

    const purchaseRouter = require("./purchase.routes")
    app.use("/api", purchaseRouter)
}   