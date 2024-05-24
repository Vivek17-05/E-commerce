import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import bcrypt from "bcrypt" ;

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number ;

    @Column()
    name: string ;

    @Column({ unique: true })
    email: string ;

    @Column()
    password: string ;

    // Many to many relationship with the Product entity
    @ManyToMany(() => Product, { cascade: true, eager: true })
    @JoinTable()
    cart: Product[] ;

    @BeforeInsert()
    async hashPassword(){   // Hash the password before inserting it into the database
        this.password = await bcrypt.hash(this.password, 10) ;
    }
}