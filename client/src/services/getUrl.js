//Use local host in development and the actual site url in deployment
export function getClientUrl() {
  return process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : process.env.REACT_APP_SERVER_URL;
}

//3 Different possible server urls: development, testing or deployed
export function getServerUrl() {
  if (process.env.NODE_ENV == "development") return "http://localhost:4000";
  else if (process.env.NODE_ENV == "test") return "";
  else return process.env.REACT_APP_SERVER_URL;
}
