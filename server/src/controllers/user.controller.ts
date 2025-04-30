export const getUsers = (req:any, res:any) => {
  res.json({ message: "Fetching all users" });
};

export const getUserById = (req:any, res:any) => {
  const { id } = req.params;
  res.json({ message: `Fetching user with ID: ${id}` });
};

export const createUser = (req:any, res:any) => {
  const { name, email } = req.body;
  res.json({ message: `Creating user with name: ${name} and email: ${email}` });
};
