import {  Table,Column, Model, Unique, DataType, BeforeSave, HasMany } from 'sequelize-typescript';
import { Post } from 'src/posts/posts.entity';
import { Like } from 'src/like/like.entity';

@Table
export class User extends Model {

    @Column({
        primaryKey:true,
        defaultValue:DataType.UUIDV4,
        type:DataType.UUID
    })
    id:string;

    @Unique
    @Column({ allowNull:false })
    username: string;

    @Unique
    @Column({ allowNull:false })
    email: string;

    @Column({ allowNull:false })
    password: string;

    @Column({defaultValue:false})
    isAdmin: boolean;

    @Column
    image: string;

    @Column
    passwordChangedAt:Date;

    @HasMany(()=>Post)
    posts:Post[]

    @HasMany(() => Like)
    like:Like[];

    @BeforeSave
    static async setPasswordChangedAt(user:User){
        if(!user.isNewRecord && user.changed('password')){
            user.setDataValue('passwordChangedAt',Date.now() - 1000);
        }
    }
}