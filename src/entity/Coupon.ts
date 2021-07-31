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
        type : 'timestamp without time zone',
    })
    expiresAt : Date

    @Column({
        name : 'assigned_at',
        type : 'timestamp without time zone',
        nullable : true
    })
    assignedAt : Date

    @Column({
        name : 'customer_email',
        nullable : true
    })
    customerEmail : String

}