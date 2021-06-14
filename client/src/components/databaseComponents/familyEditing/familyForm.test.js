import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FamilyForm from "./familyForm";
import userEvent from "@testing-library/user-event";

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
