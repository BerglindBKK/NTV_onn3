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
import { M } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
import { write } from "node:fs";

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
      //setjum inn það sem við viljum fá út úr fallinu, page 1, limit 1:
      const result = await loadMoviesPaginatedAsync("dummy/path.json", 1, 1);
      // checks if readfile was called correctly
      expect(readFile).toHaveBeenCalledWith("dummy/path.json", "utf8");
      expect(result).toEqual([fakeMovies[0]]);
    });

    it("should throw an error if readFile fails", async () => {
      //búum til error og látum mocked taka hann inn
      const readError = new Error("readFile failure");
      vi.mocked(readFile).mockRejectedValue(readError);
      await expect(
        loadMoviesPaginatedAsync("dummy/json", undefined, undefined)
      ).rejects.toThrow("loadMoviesPaginatedAsync: readFile failure");
    });

    it("should throw an error for malformed JSON", async () => {
      //mocked readFile retuurns something that looks like broken json
      vi.mocked(readFile).mockResolvedValue("this is not calid JSON");
      //call the function
      await expect(
        loadMoviesPaginatedAsync("dummy/path.json", undefined, undefined)
      )
        //check that it throws error
        .rejects.toThrow(/loadMoviesPaginatedAsync: .*valid JSON/i);
    });

    it("should throw an error if the json is not a list", async () => {
      vi.mocked(readFile).mockResolvedValue('{"id": "2"}');
      await expect(
        loadMoviesPaginatedAsync("dummy", undefined, undefined)
      ).rejects.toThrow("Expected JSON array");
    });
  });

  describe("saveMoviesAsync", () => {
    it("should call writeFile with correctly stringified data", async () => {
      const fakePath = "dummy/path.json";
      //mock writeFiles so it doesn't actually touch the disk
      vi.mocked(writeFile).mockResolvedValue();
      //call the function
      await saveMoviesAsync(fakePath, fakeMovies);
      //check that writeFile was called with correct arguments
      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledWith(
        fakePath,
        JSON.stringify(fakeMovies, null, 2)
      );
    });

    it("should throw an error if writeFile fails", async () => {
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
    it("should add a new movie to the existing list and save it", async () => {
      //mocka bæði skrif og les (readFile, writeFile)
      vi.mocked(readFile).mockResolvedValue(fakeMoviesJSON);
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const newTitle = "As Good As It Gets";
      const result = await addMoviesAsync(newTitle);
      expect(result.title).toBe(newTitle);
      expect(result.id).toBeDefined();

      const updatedList: MovieResponse[] = [
        ...fakeMovies,
        { id: result.id, title: newTitle, done: false },
      ];
      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(updatedList, null, 2)
      );
    });
  });

  describe("markMoviesDoneAsync", () => {
    it('should find a movie by ID, update its "done" status, and save', async () => {
      const initialMovies = [
        { id: "1", title: "Avengers", done: false },
        { id: "42", title: "Avengers 2", done: false },
      ];
      const idToUpdate = "42";
      const updatedMovies = [
        { id: "1", title: "Avengers", done: false },
        { id: "42", title: "Avengers 2", done: true },
      ];
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(initialMovies));
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const result = await markMoviesDoneAsync(idToUpdate, true);
      expect(result).toBe(true);
      expect(writeFile).toHaveBeenCalledTimes(1);

      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(updatedMovies, null, 2)
      );
    });

    it("should throw an error if the movie to mark as done is not found", async () => {
      const movies = [{ id: "1", title: "The matrix", done: false }];
      const nonExistentId = "432";

      vi.mocked(readFile).mockResolvedValue(JSON.stringify(movies));

      //viljum að hann throwi villu
      await expect(markMoviesDoneAsync(nonExistentId, true)).rejects.toThrow(
        "Movie not found"
      );
    });
  });

  describe("clearMoviesAsync", () => {
    it("should find a movie by ID and remove it from the list before saving", async () => {
      //fake starting data — what we pretend is inside the file
      // The function will "read" this data using our mock of readFile
      const initialMovies = [
        { id: "1", title: "Avengers", done: false },
        { id: "2", title: "Avengers 2", done: false },
        { id: "3", title: "Avengers 3", done: false },
      ];
      const idToRemove = "3";
      const updatedMovies = [
        { id: "1", title: "Avengers", done: false },
        { id: "2", title: "Avengers 2", done: false },
      ];

      //fakes the readFile() function
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(initialMovies));
      //This fakes writeFile() so that no file is really saved.
      vi.mocked(writeFile).mockResolvedValue();

      // We want to:
      //   1. Read the fake movie list,
      //   2. Remove the movie with id "3",
      //   3. Save the updated list using writeFile(),
      //   4. And return true.
      const result = await clearMoviesAsync(idToRemove);

      //check if readFile was called correctly - with some string and utf8(real text)
      expect(readFile).toHaveBeenCalledWith(expect.any(String), "utf8");
      // check if writeFile was called correctly
      // and with the updated movie list turned into a JSON string.
      expect(writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(updatedMovies, null, 2)
      );
      //should return true
      expect(result).toBe(true);
    });

    it.todo(
      "should throw an error if the movie to clear is not found",
      async () => {
        //mockup data
        const nonExistentId = "432";

        vi.mocked(readFile).mockResolvedValue(JSON.stringify(fakeMovies));
      }
    );
  });
});
