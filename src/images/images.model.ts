import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ImageCreationAttrs {
    image: string;
    essenceTable: string;
    essenceId: number;
}

@Table({tableName: 'images'})
export class Image extends Model<Image, ImageCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    image: string;

    @Column({type: DataType.STRING})
    essenceTable: string;

    @Column({type: DataType.INTEGER})
    essenceId: number;
}