import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AdminAttributes {
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
  peopleInQueue?: number;
}

export type AdminPk = 'id';
export type AdminId = Admin[AdminPk];
export type AdminOptionalAttributes =
  | 'facilityName'
  | 'facilityAddress'
  | 'zipCode'
  | 'peopleInQueue';
export type AdminCreationAttributes = Optional<
  AdminAttributes,
  AdminOptionalAttributes
>;

export class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
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
  peopleInQueue?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof Admin {
    return Admin.init(
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
        peopleInQueue: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'Admin',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
        indexes: [
          {
            name: 'Admin_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
