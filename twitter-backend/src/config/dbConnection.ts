import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_CONNECTION as string);



const connectDB = async ()=> {
  try {
    await sequelize.authenticate();
    await sequelize.sync({alter: true});
    console.log("Connection established to the database successfully.");
  }
  catch(error){
    console.error("Unable to connect to database.", error);
  }
};

export { sequelize, connectDB };