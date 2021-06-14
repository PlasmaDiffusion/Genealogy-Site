import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Home from "./home";
import FamilyLinkTree from "./tree/familyLinkTree";

describe("Home Page", function () {
  it("has a Home link", function () {
    render(<Home />);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("gets an array of families to link to", async function () {
    render(<Home onHomePage={true} />);
    expect(await screen.findAllByRole("link")).toHaveLength(1);
  });
});
