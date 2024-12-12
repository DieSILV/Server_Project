const Purchase = require('../models/Purchase.model')

const getPurchasesByUser = (req, res) => {
    const { userId } = req.params

    Purchase.find({ user: userId })
        .then(purchases => {
            if (!purchases) {
                return res.status(404).json({ error: 'No se encontraron compras para este usuario.' })
            }
            res.status(200).json(purchases)
        })
        .catch(err => res.status(500).json({ error: 'Error al obtener las compras', details: err }))
}

const createPurchase = (req, res) => {
    const { userId, productName, price, quantity } = req.body

    if (!userId || !productName || !price || !quantity) {
        return res.status(400).json({ error: 'Faltan datos necesarios: userId, productName, price, quantity.' })
    }

    const newPurchase = new Purchase({
        user: userId,
        productName,
        price,
        quantity
    })

    newPurchase.save()
        .then(purchase => res.status(201).json(purchase))
        .catch(err => res.status(500).json({ error: 'Error al crear la compra', details: err }))
}

const deletePurchase = (req, res) => {
    const { purchaseId } = req.params

    Purchase.findByIdAndDelete(purchaseId)
        .then(deletedPurchase => {
            if (!deletedPurchase) {
                return res.status(404).json({ error: 'Compra no encontrada.' })
            }
            res.status(200).json({ message: 'Compra eliminada correctamente.' })
        })
        .catch(err => res.status(500).json({ error: 'Error al eliminar la compra', details: err }))
}

module.exports = { getPurchasesByUser, createPurchase, deletePurchase }
