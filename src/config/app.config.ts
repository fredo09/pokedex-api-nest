
/**
 * 
 * @description - Carga las variables de entorno y las devuelve como un objeto
 * @returns {Object} - Retorna un objeto con la configuracion de la aplicacion
 */
export const appConfigEnviroment = () => ({
	enviroment: process.env.NODE_env || 'DEVELOPMENT',
	mongodb_url: process.env.MONGO_URL || '',
	port: process.env.PORT || 3002,
	defaultLimit: process.env.DEFAULT_LIMIT || 10,
	defaultOffset: process.env.DEFAULT_OFFSET || 0,
});
