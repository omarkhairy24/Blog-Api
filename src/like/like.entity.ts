import { Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';
import { User } from 'src/users/users.entity';
import { Post } from 'src/posts/posts.entity';

@Table
export class Like extends Model {
    
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id:string;


    @ForeignKey(() => User)
    @Column({ allowNull: false })
    userId: string;

    @ForeignKey(() => Post)
    @Column({ allowNull: false })
    postId: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Post)
    post: Post;
}