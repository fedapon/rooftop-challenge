import joi, { string } from 'joi'

const getValidation = joi.object({
    
    code : joi.string().required(),

    customer_email : joi.string().required()
    
})

export default getValidation