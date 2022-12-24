export const AuthConfig = () => ({
  refresh: String(process.env.REFRESH),
  access: String(process.env.ACCESS),
});
