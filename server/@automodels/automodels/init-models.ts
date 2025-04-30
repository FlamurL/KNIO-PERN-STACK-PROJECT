import type { Sequelize } from "sequelize";
import { SequelizeMeta as _SequelizeMeta } from "./SequelizeMeta";
import type { SequelizeMetaAttributes, SequelizeMetaCreationAttributes } from "./SequelizeMeta";
import { admin as _admin } from "./admin";
import type { adminAttributes, adminCreationAttributes } from "./admin";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _SequelizeMeta as SequelizeMeta,
  _admin as admin,
  _users as users,
};

export type {
  SequelizeMetaAttributes,
  SequelizeMetaCreationAttributes,
  adminAttributes,
  adminCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const SequelizeMeta = _SequelizeMeta.initModel(sequelize);
  const admin = _admin.initModel(sequelize);
  const users = _users.initModel(sequelize);


  return {
    SequelizeMeta: SequelizeMeta,
    admin: admin,
    users: users,
  };
}
