import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import {UserType} from '../../dtos/user.dto';

export interface usersAttributes {
  id: string;
  name?: string;
  email?: string;
  passwordHash?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  surname?: string;
  type?: UserType;
  socialSecurityNumber?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
}

export type usersPk = 'id';
export type usersId = users[usersPk];
export type usersOptionalAttributes =
  'id'
  | 'name'
  | 'email'
  | 'passwordHash'
  | 'createdAt'
  | 'updatedAt'
  | 'surname'
  | 'type'
  | 'socialSecurityNumber'
  | 'phoneNumber'
  | 'country'
  | 'city'
  | 'address'
  ;
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  id!: string;
  name?: string;
  email?: string;
  passwordHash?: string;
  isActive?: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  surname?: string;
  type?: UserType;
  socialSecurityNumber?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
      id: {
        type: DataTypes.UUID,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(UserType)),
        allowNull: true,
      },
      socialSecurityNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 16],
        }
      },
      phoneNumber: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [5, 15],
        }
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
    }, {
      sequelize,
      tableName: 'Users',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'Users_pkey',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
      ],
    });
  }
}


export default users;