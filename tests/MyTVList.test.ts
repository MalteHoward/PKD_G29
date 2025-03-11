import { yourList, library, media, fetchShowID, statusShow } from '../src/main';

// Mock the external API module
jest.mock('movier', () => ({
  searchTitleByName: jest.fn(),
}));

// Mock console-clear
jest.mock('console-clear', () => jest.fn());

// Suppress console.log during tests
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

// Mock the prompt-sync module
let userInputs: string[] = []; // Array to store user inputs for each test case
jest.mock('prompt-sync', () => {
  return jest.fn(() => (question: string) => {
    // Simulate user input based on the question
    if (question === "Option: ") return userInputs.shift(); // Return the next user input
    if (question === "Search for the show you want to edit: ") return userInputs.shift();
    if (question === "1. Change amount of episodes 2. Remove show: ") return userInputs.shift();
    if (question === "New episodes watched: ") return userInputs.shift();
    return ""; // Default response
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  library.length = 0; // Clear the library after each test
});

describe('fetchShowID', () => {
  //Valid #1
  it('should fetch show details for a valid title', async () => {
    const mockResult = {
      name: "Shrek",
      source: { sourceId: "tt0126029" },
      titleYear: 2001,
      titleType: "movie",
    };
    require('movier').searchTitleByName.mockResolvedValue([mockResult]);

    const result = await fetchShowID("Shrek");

    expect(result).toEqual({
      showID: "tt0126029",
      showyear: 2001,
      showtype: "movie",
      showTitle: "Shrek",
      episodes: -1,
      counter: -1,
      status: "",
    });
  });

  //Invalid #1
  it('should return undefined for an invalid title', async () => {
    // Mock the API response with no results
    require('movier').searchTitleByName.mockResolvedValue([]);

    const result = await fetchShowID("ThisIsNotAShow");

    expect(result).toBeUndefined();
  });
});

describe('statusShow', () => {
  //Valid #2
  it('should return "watchlist" if counter is 0', () => {
    const show: media = {
      showtype: "movie",
      showyear: 2001,
      showID: "tt0126029",
      showTitle: "Shrek",
      episodes: 1,
      counter: 0,
      status: "",
    };

    expect(statusShow(show)).toBe("watchlist");
  });

  //Valid #3
  it('should return "completed" if counter equals episodes', () => {
    const show: media = {
      showtype: "movie",
      showyear: 2001,
      showID: "tt0126029",
      showTitle: "Shrek",
      episodes: 1,
      counter: 1,
      status: "",
    };

    expect(statusShow(show)).toBe("completed");
  });

  //Valid #4
  it('should return "watching" if counter is less than episodes', () => {
    const show: media = {
      showtype: "series",
      showyear: 2008,
      showID: "tt0903747",
      showTitle: "Breaking Bad",
      episodes: 62,
      counter: 10,
      status: "",
    };

    expect(statusShow(show)).toBe("watching");
  });

  //Invalid #2
  it('should return "completed" if counter is greater than episodes', () => {
    const show: media = {
      showtype: "series",
      showyear: 2008,
      showID: "tt0903747",
      showTitle: "Breaking Bad",
      episodes: 62,
      counter: 70,
      status: "",
    };

    expect(statusShow(show)).toBe("completed");
  });
});

describe('yourList', () => {

  //Valid #5
  it('should display shows in the "Watching" list', () => {
    // Add a show to the library with status "watching"
    const show: media = {
      showtype: "series",
      showyear: 2008,
      showID: "tt0903747",
      showTitle: "Breaking Bad",
      episodes: 62,
      counter: 10,
      status: "watching",
    };
    library.push(show);

    // Simulate user choosing option 1 (Watching)
    userInputs = ["1"]; // Set user input for this test case
    yourList();

    // Verify the output
    expect(console.log).toHaveBeenCalledWith("Watching:\n");
    expect(console.log).toHaveBeenCalledWith("Breaking Bad (", 2008, ") - ", 10, "/", 62, "episodes watched");
  });

  //Valid #6
  it('should display shows in the "Completed" list', () => {
    // Add a show to the library with status "completed"
    const show: media = {
      showtype: "series",
      showyear: 2008,
      showID: "tt0903747",
      showTitle: "Breaking Bad",
      episodes: 62,
      counter: 62,
      status: "completed",
    };
    library.push(show);

    // Simulate user choosing option 2 (Completed)
    userInputs = ["2"]; // Set user input for this test case
    yourList();

    // Verify the output
    expect(console.log).toHaveBeenCalledWith("Completed:\n");
    expect(console.log).toHaveBeenCalledWith("Breaking Bad (", 2008, ") - ", 62, "/", 62, "episodes watched");
  });

  //Valid #7
  it('should display shows in the "Watchlist" list', () => {
    // Add a show to the library with status "watchlist"
    const show: media = {
      showtype: "series",
      showyear: 2008,
      showID: "tt0903747",
      showTitle: "Breaking Bad",
      episodes: 62,
      counter: 0,
      status: "watchlist",
    };
    library.push(show);

    // Simulate user choosing option 3 (Watchlist)
    userInputs = ["3"]; // Set user input for this test case
    yourList();

    // Verify the output
    expect(console.log).toHaveBeenCalledWith("Watchlist:\n");
    expect(console.log).toHaveBeenCalledWith("Breaking Bad (", 2008, ") - ", 0, "/", 62, "episodes watched");
  });

  //Valid #8
  it('should allow editing a show', () => {
    // Add a show to the library
    const show: media = {
      showtype: "series",
      showyear: 2008,
      showID: "tt0903747",
      showTitle: "Breaking Bad",
      episodes: 62,
      counter: 10,
      status: "watching",
    };
    library.push(show);

    // Simulate user choosing option 4 (Edit show)
    userInputs = ["4", "Breaking Bad", "1", "5"]; // Set user inputs for this test case
    yourList();

    // Verify the output
    expect(console.log).toHaveBeenCalledWith("You have now watched", 15, "out of", 62, "available");
    expect(library[0].counter).toBe(15); // Verify the counter was updated
  });

  //Valid #9
  it('should allow removing a show', () => {
    // Add a show to the library
    const show: media = {
      showtype: "series",
      showyear: 2008,
      showID: "tt0903747",
      showTitle: "Breaking Bad",
      episodes: 62,
      counter: 10,
      status: "watching",
    };
    library.push(show);

    // Simulate user choosing option 4 (Edit show)
    userInputs = ["4", "Breaking Bad", "2"]; // Set user inputs for this test case
    yourList();

    // Verify the output
    expect(console.log).toHaveBeenCalledWith("You have now removed", "Breaking Bad");
    expect(library.length).toBe(0); // Verify the show was removed
  });

  //Borderline #1
  it('allows removing episodes when minus numbers are entered', () => {
    // Add a show to the library
    const show: media = {
      showtype: "series",
      showyear: 2008,
      showID: "tt0903747",
      showTitle: "Breaking Bad",
      episodes: 62,
      counter: 10,
      status: "watching",
    };
    library.push(show);

    // Simulate user choosing option 4 (Edit show)
    userInputs = ["4", "Breaking Bad", "1", "-5"]; // Set user inputs for this test case
    yourList();

    // Verify the output
    expect(console.log).toHaveBeenCalledWith("You have now watched", 5, "out of", 62, "available");
    expect(library[0].counter).toBe(5); // Verify the counter was updated
  });
});
// Borderline Case #2
it('when counter entered as a NaN showStatus becomes completed', () => {
  // Add a show to the library
  const show: media = {
    showtype: "series",
    showyear: 2008,
    showID: "tt0903747",
    showTitle: "Breaking Bad",
    episodes: 62, 
    counter: NaN, //NaN (Not a Number)
    status: "",
  };

  expect(statusShow(show)).toBe("completed");
});