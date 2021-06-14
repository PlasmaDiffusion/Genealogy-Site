import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Navbar from "./navbar";

describe("Navbar", function () {
  it("should have 3 <a> links when displaying details of a family", async function () {
    render(<Navbar testing={true} />);
    expect(await screen.findAllByRole("link")).toHaveLength(3);
  });
});
