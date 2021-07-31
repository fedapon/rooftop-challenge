import joi, { string } from 'joi'

const deleteValidation = joi.object({
    
    code : joi.string().required(),
    
})

export default deleteValidation