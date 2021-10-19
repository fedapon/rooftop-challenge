import joi, { string } from "joi"

const getValidation = joi.object({
    code: joi.string().required(),
    customer_email: joi.string().required(),
})

const postValidation = joi.object({
    code: joi.string().alphanum().length(8).required(),

    expires_at: joi.date().greater("now").required(),
})

const patchValidation = joi.object({
    code: joi.string().alphanum().length(8).required(),

    customer_email: joi.string().email().required(),
})

const deleteValidation = joi.object({
    code: joi.string().required(),
})

export { getValidation, postValidation, patchValidation, deleteValidation }
