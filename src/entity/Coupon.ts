import { Column, Entity } from "typeorm";
import AbstractEntity from "./AbstractEntity";

@Entity({name : 'coupons'})
export default class Coupon extends AbstractEntity {

    @Column({
        length : 8
    })
    code : String

    @Column({
        name : 'expires_at',
        type : 'timestamptz',
        nullable : true
    })
    expiresAt : Date

    @Column({
        name : 'assigned_at',
        type : 'timestamptz',
        nullable : true
    })
    assignedAt : Date

    @Column({
        name : 'customer_email',
        nullable : true
    })
    customerEmail : String

}