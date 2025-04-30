"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserById = exports.getUsers = void 0;
const getUsers = (req, res) => {
    res.json({ message: "Fetching all users" });
};
exports.getUsers = getUsers;
const getUserById = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Fetching user with ID: ${id}` });
};
exports.getUserById = getUserById;
const createUser = (req, res) => {
    const { name, email } = req.body;
    res.json({ message: `Creating user with name: ${name} and email: ${email}` });
};
exports.createUser = createUser;
