import React from "react";
import axios from "axios";

import { getServerUrl } from "./getUrl.js";

//Front end tests and events
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

//Api mocks
import { rest } from "msw";
import { setupServer } from "msw/node";

//Components to test
import App from "./App";

/*
//Mock request tests
const server = setupServer(
  rest.get("/read/categories/", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 0, name: "All" },
        { id: 1, name: "Food" },
        { id: 2, name: "Office Supplies" },
        { id: 3, name: "Test" },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

//Loading component
describe("Loading component", function () {
  it("renders a basic loading <p> message, and should not render a heading unless logged in", function () {
    render(<Loading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(screen.queryByRole("heading")).toBeNull();
  });
});

//Product
describe("Product Page component", function () {
  it("renders 3 items", async function () {
    const products = [
      { id: 1, name: "Apple" },
      { id: 2, name: "Orange" },
      { id: 3, name: "Banana" },
    ];

    //const promise = Promise.resolve({ data: { hits: products } });

    //axios.get.mockImplementationOnce(() => promise);

    render(<ProductBanner product={products[0]} />);
    render(<ProductBanner product={products[1]} />);
    render(<ProductBanner product={products[2]} />);

    //screen.debug();

    //await act(() => promise);

    expect(screen.getAllByRole("heading")).toHaveLength(3);
  });
});

//Cart
describe("Cart component", function () {
  it("should have at least two items", async function () {
    render(<Cart test={true} />);

    expect(screen.getAllByRole("heading")).toHaveLength(2);
  });
});

//Quantity buttons
describe("Quanity button component", function () {
  it("should have two buttons and show a quantity of 1, then a quantity of 2", async function () {
    render(<QuantityButtons amount={1} max={3} onAmountChanged={() => {}} />);

    expect(screen.getAllByRole("button")).toHaveLength(2);

    expect(screen.getByText("1")).toBeInTheDocument();

    userEvent.click(screen.getByText("+"));

    expect(await screen.findByText("2")).toBeInTheDocument();
  });
});

//Search bar
describe("Searchbar", function () {
  it("should read in multiple categories", async function () {
    render(<SearchBar />);

    expect(await screen.findByText("Food")).toBeInTheDocument();
    expect(await screen.findAllByText("All")).toHaveLength(2);
    expect(await screen.findByText("Office Supplies")).toBeInTheDocument();
    expect(await screen.findByText("Test")).toBeInTheDocument();

    screen.debug();
  });
});
*/
