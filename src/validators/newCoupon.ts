import joi from 'joi'

const newCoupon = joi.object({
    code : joi.string().alphanum().length(8).required(),
  
    expires_at : joi.date().empty().greater('now')

})

export default newCoupon