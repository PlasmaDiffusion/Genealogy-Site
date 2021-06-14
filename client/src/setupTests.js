//Api mocks
import { rest } from "msw";
import { setupServer } from "msw/node";

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
