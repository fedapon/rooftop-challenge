import "reflect-metadata"
import { connection } from "../app"
import { Request, Response } from "express"
import Coupon from "../entity/Coupon"
import {
    getValidation,
    postValidation,
    patchValidation,
    deleteValidation,
} from "../validators/couponsValidation"

function errorResponse(res: Response, err: any, status: number) {
    return res.status(status).json({ message: err.message })
}

export async function GetCouponsAction(req: Request, res: Response) {
    //validation
    let validationResult = getValidation.validate(req.body)
    if (validationResult.error) {
        return res
            .status(404)
            .json({ message: validationResult.error.details[0].message })
    }

    let repository = (await connection).getRepository(Coupon)
    //try to find code and email match
    await repository
        .findOne({
            code: req.body.code,
            customerEmail: req.body.customer_email,
        })
        .then((data) => {
            if (data == undefined) {
                return res
                    .status(404)
                    .json({ message: "Coupon code and email was not found" })
            }
            return res
                .status(200)
                .json({ message: "Coupon and email match was found" })
        })
        .catch((err) => {
            return errorResponse(res, err, 404)
        })
}

export async function PostCouponsAction(req: Request, res: Response) {
    //validation
    let validationResult = postValidation.validate(req.body)
    if (validationResult.error) {
        return res
            .status(422)
            .json({ message: validationResult.error.details[0].message })
    }

    let repository = (await connection).getRepository(Coupon)
    //check if code already exists
    let searchedCode = await repository.findOne({ code: req.body.code })
    if (searchedCode != undefined) {
        return res.status(422).json({ message: "Coupon code already exists" })
    }

    //lets add the new code to the repository
    let newCoupon = new Coupon()
    newCoupon.code = req.body.code
    newCoupon.expiresAt = req.body.expires_at

    await repository
        .save(newCoupon)
        .then(() => {
            return res
                .status(201)
                .json({ message: "Coupon successfully created" })
        })
        .catch((err) => {
            return errorResponse(res, err, 422)
        })
}

export async function PatchCouponsAction(req: Request, res: Response) {
    //validation
    let validationResult = patchValidation.validate(req.body)
    if (validationResult.error) {
        return res
            .status(422)
            .json({ message: validationResult.error.details[0].message })
    }

    let repository = (await connection).getRepository(Coupon)
    //check that the email wasn't already used
    let emailAvailable = await repository.findOne({
        customerEmail: req.body.customer_email,
    })
    if (emailAvailable) {
        return res.status(422).json({ message: "Email has already been used" })
    }

    await repository
        .findOne({ code: req.body.code })
        .then((codeAvailable) => {
            let currentTime = new Date()
            //check that the code exists, is available and isn't expired
            if (
                codeAvailable == undefined ||
                codeAvailable.customerEmail != null ||
                (codeAvailable.expiresAt != null &&
                    codeAvailable.expiresAt < currentTime)
            ) {
                return res
                    .status(422)
                    .json({ message: "Coupon is not available" })
            }
            //update de available code with te customer email and timestamp
            codeAvailable.customerEmail = req.body.customer_email
            codeAvailable.assignedAt = currentTime
            //save the entity in database
            repository
                .save(codeAvailable)
                .then(() => {
                    return res
                        .status(201)
                        .json({ message: "Coupon successfully consumed" })
                })
                .catch((err) => {
                    return errorResponse(res, err, 422)
                })
        })
        .catch((err) => {
            return errorResponse(res, err, 422)
        })
}

export async function DeleteCouponsAction(req: Request, res: Response) {
    //validation
    let validationResult = deleteValidation.validate(req.body)
    if (validationResult.error) {
        return res
            .status(422)
            .json({ message: validationResult.error.details[0].message })
    }

    let repository = (await connection).getRepository(Coupon)
    await repository
        .findOne({ code: req.body.code })
        .then((codeToDelete) => {
            //check if code exist or has been used by an email
            if (codeToDelete == undefined) {
                return res.status(422).json({ message: "Code does not exist" })
            }
            if (codeToDelete.customerEmail != null) {
                return res
                    .status(422)
                    .json({ message: "Code has already been used" })
            }

            //everything checked, let's delete
            repository
                .delete(codeToDelete)
                .then(() => {
                    return res
                        .status(201)
                        .json({ message: "Code successfully deleted" })
                })
                .catch((err) => {
                    return errorResponse(res, err, 422)
                })
        })
        .catch((err) => {
            return errorResponse(res, err, 422)
        })
}
