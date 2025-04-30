"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const sequelize_1 = require("sequelize");
class users extends sequelize_1.Model {
    static associate(models) {
    }
    static initModel(sequelize) {
        return users.init({
            passwordHash: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'users',
            schema: 'public',
            timestamps: true,
            indexes: [
                {
                    name: "users_pkey",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ]
                },
            ]
        });
    }
}
exports.users = users;
exports.default = users;
