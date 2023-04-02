import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";

interface BlockCreationAttrs {
    uniqueName: string;
    name: string;
    group: string;
    image: string;
    text: string;
}

@Table({tableName: 'blocks'})
export class Block extends Model<Block, BlockCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    uniqueName: string;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING})
    image: string;

    @Column({type: DataType.STRING})
    text: string;

    @Column({type: DataType.STRING, allowNull: false})
    group: string;
}