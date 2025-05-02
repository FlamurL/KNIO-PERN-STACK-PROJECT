import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UsersAttributes {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  peopleInQueue?: number;
}

export type UsersPk = 'id';
export type UsersId = Users[UsersPk];
export type UsersOptionalAttributes = 'peopleInQueue';
export type UsersCreationAttributes = Optional<
  UsersAttributes,
  UsersOptionalAttributes
>;

export class Users
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  id!: string;
  name!: string;
  email!: string;
  passwordHash!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  peopleInQueue?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof Users {
    console.log('Users.initModel called'); // Debug
    return Users.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        peopleInQueue: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'Users', // Explicitly set model name
        tableName: 'Users',
        schema: 'public',
        timestamps: true,
        freezeTableName: true,
        indexes: [
          {
            name: 'Users_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'Users_email_unique',
            unique: true,
            fields: [{ name: 'email' }],
          },
        ],
      }
    );
  }
}

export default Users;
