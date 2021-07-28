import { Column, Entity } from "typeorm";
import AbstractEntity from "./AbstractEntity";

@Entity({name : 'stores'})
export default class Store extends AbstractEntity {

    @Column({
        length : 100
    })
    name : String

    @Column({
        length : 100
    })
    address : String
}