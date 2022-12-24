export const ServerConfig = () => ({
  port: parseInt(String(process.env.PORT), 10),
});
