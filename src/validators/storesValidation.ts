import joi from "joi"

const postValidation = joi.object({
    name: joi.string().required(),

    address: joi.string().required(),
})

const deleteValidation = joi.object({
    id: joi.number().required(),
})

export { postValidation, deleteValidation }
