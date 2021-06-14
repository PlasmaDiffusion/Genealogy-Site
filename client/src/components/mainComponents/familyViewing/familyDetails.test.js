import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FamilyDetails from "./familyDetails";

describe("Family Details", function () {
  it("should get family details and display 2 full names (3 <h2>s each)", async function () {
    //Set up url with query containing id
    window.location.replace("/" + "?id=6006327068e4240017d43574");

    render(<FamilyDetails />);

    expect(await screen.findAllByRole("heading", { level: 2 })).toHaveLength(6);
  });
});
