export const config = {
  PORT: 3000,

  MYSQL: {
    HOST: 'localhost',
    PORT: 3306,
    USER: 'root',
    PASSWORD: '',
    DATABASE: 'veterinaria_db',
  },
  
MONGODB: {
    URI: 'mongodb://localhost:27017/veterinaria_mongo',
    OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  JWT: {
    SECRET: 'clave_super_secreta_1234',
    EXPIRES_IN: '1d',
  },
};
