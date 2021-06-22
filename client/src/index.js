import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import Auth0ProviderWithHistory from "./services/auth0Provider";



ReactDOM.render(
        <Auth0ProviderWithHistory>
    <App />
        </Auth0ProviderWithHistory>, document.getElementById("root"));
