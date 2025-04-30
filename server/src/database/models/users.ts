import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface usersAttributes {
  id: string;
  name?: string;
  email?: string;
  passwordHash: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  peopleInQueue?: number;
}

export type usersPk = 'id';
export type usersId = users[usersPk];
export type usersOptionalAttributes =
  | 'name'
  | 'email'
  | 'isActive'
  | 'peopleInQueue';
export type usersCreationAttributes = Optional<
  usersAttributes,
  usersOptionalAttributes
>;

export class users
  extends Model<usersAttributes, usersCreationAttributes>
  implements usersAttributes
{
  id!: string;
  name?: string;
  email?: string;
  passwordHash!: string;
  isActive?: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  peopleInQueue?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
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
        tableName: 'users',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
        indexes: [
          {
            name: 'users_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
