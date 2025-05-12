import bcrypt from 'bcrypt';

// Encrypt password (used in registerAdmin)
export const encrypt = async (password: string): Promise<string> => {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Error in encrypt:', error);
    throw new Error('Password encryption failed');
  }
};

// Validate password (used in authenticateAdmin)
export const validateUser = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    console.log('Validating password:', { plainPassword, hashedPassword });
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error in validateUser:', error);
    throw new Error('Password validation failed');
  }
};
