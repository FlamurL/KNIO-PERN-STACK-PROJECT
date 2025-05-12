import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Admin, AdminId } from './Admin';

export interface UsersAttributes {
  id: string;
  name?: string;
  email?: string;
  passwordHash: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  peopleInQueue?: number;
  currentQueueId?: string;
}

export type UsersPk = 'id';
export type UsersId = Users[UsersPk];
export type UsersOptionalAttributes =
  | 'name'
  | 'email'
  | 'isActive'
  | 'peopleInQueue'
  | 'currentQueueId';
export type UsersCreationAttributes = Optional<
  UsersAttributes,
  UsersOptionalAttributes
>;

export class Users
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  id!: string;
  name?: string;
  email?: string;
  passwordHash!: string;
  isActive?: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  peopleInQueue?: number;
  currentQueueId?: string;

  // Users belongsTo Admin via currentQueueId
  currentQueue!: Admin;
  getCurrentQueue!: Sequelize.BelongsToGetAssociationMixin<Admin>;
  setCurrentQueue!: Sequelize.BelongsToSetAssociationMixin<Admin, AdminId>;
  createCurrentQueue!: Sequelize.BelongsToCreateAssociationMixin<Admin>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Users {
    return Users.init(
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
        currentQueueId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'Admin',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'Users',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
        indexes: [
          {
            name: 'Users_currentQueueId_fk',
            fields: [{ name: 'currentQueueId' }],
          },
          {
            name: 'Users_email_unique',
            unique: true,
            fields: [{ name: 'email' }],
          },
          {
            name: 'Users_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
