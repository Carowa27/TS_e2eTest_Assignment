import { IOmdbResponse } from "../../src/ts/models/IOmdbResponse";

const mockNoMovies: IOmdbResponse = { Search: [] };

const mockMovies: IOmdbResponse = {
  Search: [
    {
      Title: "Toy Story 3",
      Year: "2010",
      imdbID: "tt0435761",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMTgxOTY4Mjc0MF5BMl5BanBnXkFtZTcwNTA4MDQyMw@@._V1_SX300.jpg",
    },
    {
      Title: "Toy Story",
      Year: "1995",
      imdbID: "tt0114709",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMj…TViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg",
    },
    {
      Title: "Toy Story",
      Year: "1995",
      imdbID: "tt0114709",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMj…TViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg",
    },
    {
      Title: "Toy Story 2",
      Year: "1999",
      imdbID: "tt0120363",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMWM5ZDcxMT…WY4NDIwXkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_SX300.jpg",
    },
    {
      Title: "Toy Story 4",
      Year: "2019",
      imdbID: "tt1979376",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_SX300.jpg",
    },
  ],
};

beforeEach(() => {
  cy.visit("/");
});

describe("should test movieApp", () => {
  it("should have a form", () => {
    cy.get("#searchForm");
    cy.get("#searchText");
    cy.get("#search");
  });
  it("should have a container to fill with movies", () => {
    cy.get("#movie-container");
  });
  it("should display results from real API", () => {
    cy.get("#searchText").type("Hunger games");
    cy.get("#searchText").should("have.value", "Hunger games");
    cy.get("#search").click();

    cy.get("#movie-container:has(h3)").should("contain", "Hunger Games");
    cy.get("#movie-container>div").should("have.length.above", 3);
    cy.get("#movie-container>div").should("have.class", "movie");
    cy.get(".movie > h3").should("have.length.above", 3);
    cy.get(".movie > img").should("have.length.above", 3);
  });
  it("should display results from mock API", () => {
    cy.intercept("GET", "http://omdbapi.com/*", mockMovies).as("mockMovies");
    cy.get("#searchText").type("Toy Story");
    cy.get("#searchText").should("have.value", "Toy Story");
    cy.get("#search").click();

    cy.wait("@mockMovies").its("request.url").should("contain", "Toy");
    cy.get("#movie-container:has(h3)").should("contain", "Toy Story");
    cy.get("#movie-container>div").should("have.length.above", 3);
    cy.get("#movie-container>div").should("have.class", "movie");
    cy.get(".movie > h3").should("have.length.above", 3);
    cy.get(".movie > img").should("have.length.above", 3);
  });
  it("should display results from no mock API", () => {
    cy.intercept("GET", "http://omdbapi.com/*", mockNoMovies).as(
      "mockNoMovies"
    );
    cy.get("#searchText").type("Fast & Furious");
    cy.get("#searchText").should("have.value", "Fast & Furious");
    cy.get("#search").click();

    cy.wait("@mockNoMovies").its("request.url").should("contain", "Fast");
    cy.get("#movie-container>div").should("have.length", 0);
    cy.get("p").contains("Inga sökresultat att visa");
  });
  it("should get error msg", () => {
    cy.get("#searchText").clear();
    cy.get("#search").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });
});
