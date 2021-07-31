import joi from 'joi'

const postValidation = joi.object({
    code : joi.string().alphanum().length(8).required(),
  
    expires_at : joi.date().empty().greater('now')

})

export default postValidation