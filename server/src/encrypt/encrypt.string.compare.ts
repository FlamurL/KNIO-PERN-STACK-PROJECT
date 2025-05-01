import bcrypt from 'bcrypt';

const saltRounds = 10;

export const encrypt = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const validateUser = async (
  password_db: string,
  password_to_validate: string
) => {
  const res = await bcrypt.compare(password_to_validate, password_db);
  return res;
};
