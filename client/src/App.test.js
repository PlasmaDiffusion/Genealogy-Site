import React from "react";
import axios from "axios";
import { Route, BrowserRouter as Router } from "react-router-dom";

//Front end tests and events
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

//Api mocks
import { rest } from "msw";
import { setupServer } from "msw/node";

//Components to test
import App from "./App";
import Home from "./components/home";
import FamilyLinkTree from "./components/tree/familyLinkTree.jsx";
import FamilyDetails from "./components/familyDetails.jsx";
import FamilyForm from "./components/databaseComponents/familyForm.jsx";
import Navbar from "./components/navbar/navbar.jsx";

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

describe("Home Page", function () {
  it("has a Home link", function () {
    render(<Home />);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("gets an array of families to link to", async function () {
    render(<FamilyLinkTree onHomePage={true} />);
    expect(await screen.findAllByRole("link")).toHaveLength(8);
  });
});

describe("Navbar", function () {
  it("should have 3 <a> links when displaying details of a family", async function () {
    render(<Navbar testing={true} />);
    expect(await screen.findAllByRole("link")).toHaveLength(3);
  });
});

describe("Family Details", function () {
  it("should get family details and display 2 full names (3 <h2>s each)", async function () {
    //Set up url with query containing id
    window.location.replace("/" + "?id=6006327068e4240017d43574");

    render(<FamilyDetails />);

    expect(await screen.findAllByRole("heading", { level: 2 })).toHaveLength(6);
  });
});

describe("Family Form", function () {
  it("dynamically adds more <input> fields for children", async function () {
    render(<FamilyForm />);
    expect(screen.getByText("+ Child")).toBeInTheDocument();

    //Call add button and check for more data list input fields
    await userEvent.click(screen.getByRole("addChild"));
    await userEvent.click(screen.getByRole("addChild"));

    expect(await screen.findAllByText("Child:")).toHaveLength(2);
  });

  it("takes in input and calls an on change event", async function () {
    render(<FamilyForm />);

    var input = screen.getByRole("familyNameInput");
    fireEvent.change(input, { target: { value: "Family" } });
    expect(input.value).toBe("Family");
  });
});
