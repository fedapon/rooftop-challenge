import joi from 'joi'

const deleteValidation = joi.object({
    id : joi.number().required()

})

export default deleteValidation