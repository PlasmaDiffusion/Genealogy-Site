import React from "react";
import axios from "axios";
import { Route, BrowserRouter as Router } from "react-router-dom";

import { getServerUrl } from "./components/getUrl";

//Front end tests and events
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

//Api mocks
import { rest } from "msw";
import { setupServer } from "msw/node";

//Components to test
import App from "./App";
import Home from "./components/Home";
import FamilyLinkTree from "./components/databaseComponents/familyLinkTree";
import FamilyDetails from "./components/familyDetails";

//Mock request tests
const server = setupServer(
  //Homepage links to be displayed on a grid (has to be 5x5, so an array of 25)
  rest.get("/read/familyGroup/", (req, res, ctx) => {
    return res(
      ctx.json({
        names: [
          "",
          "",
          "",
          "",
          "",
          "",
          "McNee",
          "",
          "Robertson",
          "",
          "",
          "",
          "Hamilton",
          "",
          "",
          null,
          null,
          null,
          "Scott",
          null,
          "",
          null,
          "",
          null,
          "",
        ],
        linkOrder: [
          null,
          null,
          null,
          null,
          null,
          null,
          1,
          null,
          3,
          null,
          null,
          null,
          2,
          null,
          4,
          null,
          5,
          null,
          6,
          null,
          null,
          null,
          7,
          null,
          8,
        ],
      })
    );
  }),
  //Family links
  rest.get("/read/family/:id", (req, res, ctx) => {
    return res(
      ctx.json({
        name: "A Family Name",
        description: "A description",
        parentA: {
          name: "Some Person",
        },
        parentB: {
          name: "Some Other Person",
        },
        children: [],
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Home page", function () {
  it("has a Home link", function () {
    render(<Home />);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("gets an array of families to link to", async function () {
    render(<FamilyLinkTree onHomePage={true} />);
    expect(await screen.findAllByRole("link")).toHaveLength(8);
  });
});

describe("Family details", function () {
  it("should get family details and display 2 full names (3 <h2>s each)", async function () {
    //Set up url with query containing id
    const newUrl = "?id=6006327068e4240017d43574";
    /*Object.defineProperty(window.location, "hash", {
      writable: true,
      value: newUrl,
    });*/

    /*render(
      <Router>
        <Route path="/family/%20?id=6006327068e4240017d43574">
          <FamilyDetails />
        </Route>
      </Router>
    );*/

    render(<FamilyDetails />);

    expect(await screen.findAllByRole("heading", { level: 2 })).toHaveLength(6);
  });
});
