import bcrypt from "bcrypt";

const hashString = (str: string, saltRounds: number = 10) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(str, salt);
};

const comparePassword = (plainTextPassword: string, hashedPassword: string) => {
  const match = bcrypt.compareSync(plainTextPassword, hashedPassword);
  if (match){
    return true;
  }
  else {
    return false;
  }
}

const getOffset = (page: number, limit: number) => (page -1) * limit;
const getTotalPages = (count: number, limit: number) => Math.ceil(count/limit);

export { hashString, comparePassword, getTotalPages, getOffset };
