import joi, { string } from 'joi'

const patchValidation = joi.object({
    
    code : joi.string().alphanum().length(8).required(),

    customer_email : joi.string().email().required()
    
})

export default patchValidation