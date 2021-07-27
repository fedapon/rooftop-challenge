import { PrimaryGeneratedColumn } from "typeorm"

export default abstract class AbstractEntity {

    @PrimaryGeneratedColumn({
        type : 'bigint'
    })
    id : Number

}