import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface adminAttributes {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  passwordHash: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: "ADMIN" | "EMPLOYEE" | "MANAGER";
  socialSecurityNumber: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
}

export type adminPk = "id";
export type adminId = admin[adminPk];
export type adminOptionalAttributes = "name" | "surname" | "email" | "isActive" | "type" | "phoneNumber" | "country" | "city" | "address";
export type adminCreationAttributes = Optional<adminAttributes, adminOptionalAttributes>;

export class admin extends Model<adminAttributes, adminCreationAttributes> implements adminAttributes {
  id!: string;
  name?: string;
  surname?: string;
  email?: string;
  passwordHash!: string;
  isActive?: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  type!: "ADMIN" | "EMPLOYEE" | "MANAGER";
  socialSecurityNumber!: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof admin {
    return admin.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("ADMIN","EMPLOYEE","MANAGER"),
      allowNull: false,
      defaultValue: "ADMIN"
    },
    socialSecurityNumber: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'admin',
    schema: 'public',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "admin_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
