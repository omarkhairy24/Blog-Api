import { Column,BelongsTo,Table,DataType,Model, ForeignKey, PrimaryKey, AutoIncrement,NotNull, HasMany } from "sequelize-typescript";
import { Like } from "src/like/like.entity";
import { User } from "src/users/users.entity";

@Table
export class Post extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id:string;

    @Column({ allowNull:false })
    cover:string;

    @Column({ allowNull:false })
    content:string;

    @Column({ allowNull:false })
    highlight:string;

    @Column(DataType.JSON)
    images:string[];

    @ForeignKey(() =>User)
    @Column({ allowNull:false })
    userId:string;

    @BelongsTo(() => User)
    user:User

    @HasMany(() => Like)
    like:Like[];

    @Column(DataType.VIRTUAL)
    get likeCount(): number {
        if (this.getDataValue('like')) {
            return this.getDataValue('like').length;
        } else {
            return 0;
        }
    }
}