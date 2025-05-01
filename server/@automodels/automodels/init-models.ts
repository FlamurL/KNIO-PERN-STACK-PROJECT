import type { Sequelize } from "sequelize";
import { Admin as _Admin } from "./Admin";
import type { AdminAttributes, AdminCreationAttributes } from "./Admin";
import { SequelizeMeta as _SequelizeMeta } from "./SequelizeMeta";
import type { SequelizeMetaAttributes, SequelizeMetaCreationAttributes } from "./SequelizeMeta";
import { Users as _Users } from "./Users";
import type { UsersAttributes, UsersCreationAttributes } from "./Users";

export {
  _Admin as Admin,
  _SequelizeMeta as SequelizeMeta,
  _Users as Users,
};

export type {
  AdminAttributes,
  AdminCreationAttributes,
  SequelizeMetaAttributes,
  SequelizeMetaCreationAttributes,
  UsersAttributes,
  UsersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Admin = _Admin.initModel(sequelize);
  const SequelizeMeta = _SequelizeMeta.initModel(sequelize);
  const Users = _Users.initModel(sequelize);


  return {
    Admin: Admin,
    SequelizeMeta: SequelizeMeta,
    Users: Users,
  };
}
