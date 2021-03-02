//Use local host in development
export function getClientUrl() {
  return process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://genealogy-site.herokuapp.com";
}

//3 Different possible server urls: development, testing or deployed
export function getServerUrl() {
  if (process.env.NODE_ENV == "development") return "http://localhost:4000";
  else if (process.env.NODE_ENV == "test") return "";
  else return "https://genealogy-site.herokuapp.com";
}
