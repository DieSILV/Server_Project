const mongoose = require('mongoose')

const Company = require('../models/Company.model')

const getCompany = (req, res, next) => {
    Company
        .find()
        .then(companies => res.json(companies))
        .catch(err => next(err))
}

const getOneCompany = (req, res, next) => {

    const { _id: CompanyId } = req.params

    if (!mongoose.Types.ObjectId.isValid(CompanyId)) {
        res.status(404).json({ message: "id not valid )" })
        return
    }

    Company
        .findById(CompanyId)
        // .select({})
        .then(companies => res.json(companies))
        .catch(err => next(err))
}

const getCompanyUser = (req, res, next) => {
    const { owner } = req.params

    if (!mongoose.Types.ObjectId.isValid(owner)) {
        res.status(404).json({ message: "id not valid )" })
        return
    }

    Company
        .findOne({ owner: owner })
        .then(company => {
            if (!company) {
                res.status(404).json({ message: "Company not found" })
                return
            }
            res.json(company)
        })
        .catch(err => next(err))
}

const saveCompany = (req, res, next) => {
    const {
        name,
        logo,
        description,
        category,
        address,
        phone,
    } = req.body
    const { _id: owner } = req.payload

    Company
        .create({ name, logo, description, category, phone, address, owner })
        .then(companies => res.status(201).json(companies))
        .catch(err => next(err))
}

const editCompany = (req, res, next) => {
    const { name, description, logo } = req.body
    const { _id: companyId } = req.params

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(404).json({ message: "ID not valid" })
    }

    Company
        .findByIdAndUpdate(
            companyId,
            { name, description, logo },
            { runValidators: true, new: true }
        )
        .then((updatedCompany) => {
            if (!updatedCompany) {
                return res.status(404).json({ message: "Company not found" })
            }
            res.status(200).json(updatedCompany)
        })
        .catch(err => next(err))
}

const deleteCompany = (req, res, next) => {

    const { _id: companyId } = req.params

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        res.status(404).json({ message: "id not valid )" })
        return
    }

    Company
        .findByIdAndDelete(companyId)
        .then(() => res.sendStatus(200))
        .catch(err => next(err))
}

const filterCompanies = (req, res, next) => {
    Company
        .find(req.query)
        .then(companies => {
            if (!companies) {
                return res.status(404).json({ message: 'Producto no encontrado' })
            }
            res.json(companies)
        })
        .catch(err => next(err))
}

const categoryfilter = (req, res, next) => {
    const { categories } = req.query
    const filter = {}

    if (categories) {
        filter.categories = { $ne: [] }
    }

    Company
        .find(filter)
        .then(companies => {
            if (companies.length === 0) {
                return res.status(404).json({ message: 'No se encontraron empresas con categorías' })
            }
            res.status(200).json(companies)
        })
        .catch(err => next(err))
}


module.exports = {
    getCompany,
    getOneCompany,
    saveCompany,
    editCompany,
    deleteCompany,
    filterCompanies,
    categoryfilter,
    getCompanyUser
}