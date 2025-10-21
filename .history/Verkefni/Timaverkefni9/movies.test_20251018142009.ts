import { vi, describe, it, expect, beforeEach } from "vitest";
import { readFile, writeFile } from "node:fs/promises";
import {
  loadMoviesPaginatedAsync,
  saveMoviesAsync,
  addMoviesAsync,
  markMoviesDoneAsync,
  clearMoviesAsync,
  MovieResponse,
} from "./movies.js";

//mockum importin
vi.mock("node:fs/promises");

//havð á að gera við mockið:

const fakeMovies: MovieResponse[] = [
  {
    id: "9a809de6-2739-4fee-a627-d9d9db1fbff5",
    title: "Avengers: End Game",
    done: false,
  },
  {
    id: "bc47ea15-9234-481a-8778-374c48eba27e",
    title: "Avengers: Infinity War",
    done: true,
  },
  {
    id: "efe45ccf-6996-431d-8d75-535861363bef",
    title: "The Avengers",
    done: true,
  },
];

const fakeMoviesJSON = JSON.stringify(fakeMovies);

describe("movies.ts - Data Logic Unit Tests", () => {
  //resetta mockinn fyrir hvert einasta prof:
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("loadMoviesPaginatedAsync", () => {
    it("should load and parse movies correctly without pagination", async () => {
      //þegar einhver kallar á readfile inní þessu testi á það að skila fakeMoviesJSON. Þarf ekki að kalla á readfile
      vi.mocked(readFile).mockResolvedValue(fakeMoviesJSON);

      // calls the function under test
      //skiptir engu máli hvað er í readFile, það mun skila fakeMoviesJSON
      const result = await loadMoviesPaginatedAsync(
        "dummy/path.json",
        undefined,
        undefined
      );

      // checks if readfile was called correctly
      expect(readFile).toHaveBeenCalledWith("dummy/path.json", "utf8");
      expect(readFile).toHaveBeenCalledTimes(1);
      //checks if the function returned the movies we expected.
      expect(result).toEqual(fakeMovies);
    });

    it("should return a correctly paginated slice of movies", async () => {
      //should read the fakeMovieJSON
      vi.mocked(readFile).mockResolvedValue(fakeMoviesJSON);
      //setjum inn það sem við viljum fá út úr fallinu, limit 1, page 2:
      const result = await loadMoviesPaginatedAsync("dummy/path.json", 1, 2);
      // checks if readfile was called correctly
      expect(readFile).toHaveBeenCalledWith("dummy/path.json", "utf8");
      expect(result).toEqual(fakeMovies[1]);
    });

    it.todo("should throw an error if readFile fails", async () => {});

    it.todo("should throw an error for malformed JSON", async () => {});
  });

  describe("saveMoviesAsync", () => {
    it("should call writeFile with correctly stringified data", async () => {});

    it.todo("should throw an error if writeFile fails", async () => {
      //viljum láta promise faila, búum til error
      const readError = new Error("File system error: No access puny human");
      //tekur inn error. Readfile er promise, promise resolve(takast) eða rejecta(throwa exception)
      vi.mocked(readFile).mockRejectedValue(readError);
      await expect(
        loadMoviesPaginatedAsync("dummy/json", undefined, undefined)
      ).rejects.toThrow(
        "loadMoviesPaginatedAsync: File system error: No access puny human"
      );
    });
  });

  describe("addMoviesAsync", () => {
    it.todo(
      "should add a new movie to the existing list and save it",
      async () => {}
    );
  });

  describe("markMoviesDoneAsync", () => {
    it.todo(
      'should find a movie by ID, update its "done" status, and save',
      async () => {}
    );

    it.todo(
      "should throw an error if the movie to mark as done is not found",
      async () => {}
    );
  });

  describe("clearMoviesAsync", () => {
    it.todo(
      "should find a movie by ID and remove it from the list before saving",
      async () => {}
    );

    it.todo(
      "should throw an error if the movie to clear is not found",
      async () => {}
    );
  });
});
