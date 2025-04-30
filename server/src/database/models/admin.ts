import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface adminAttributes {
  id: string;
  facilityName?: string;
  facilityAddress?: string;
  zipCode?: string;
  country: string;
  city: string;
  email: string;
  password: string;
  waitingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export type adminPk = 'id';
export type adminId = admin[adminPk];
export type adminOptionalAttributes =
  | 'facilityName'
  | 'facilityAddress'
  | 'zipCode';
export type adminCreationAttributes = Optional<
  adminAttributes,
  adminOptionalAttributes
>;

export class admin
  extends Model<adminAttributes, adminCreationAttributes>
  implements adminAttributes
{
  id!: string;
  facilityName?: string;
  facilityAddress?: string;
  zipCode?: string;
  country!: string;
  city!: string;
  email!: string;
  password!: string;
  waitingTime!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof admin {
    return admin.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        facilityName: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        facilityAddress: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        zipCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        waitingTime: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'admin',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
        indexes: [
          {
            name: 'admin_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
