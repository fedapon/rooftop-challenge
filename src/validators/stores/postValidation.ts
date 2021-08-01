import joi from 'joi'

const postValidation = joi.object({
    name : joi.string().required(),
  
    address : joi.string().required()

})

export default postValidation