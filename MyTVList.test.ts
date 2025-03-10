import { fetchShowID, statusShow, yourList, library } from "./main";
import { searchTitleByName, TitleMainType, Source, ISourceDetails } from "movier";

// Mock searchTitleByName
const mockSearchTitleByName = jest.fn() as jest.MockedFunction<typeof searchTitleByName>;
jest.mock("movier", () => ({
  searchTitleByName: mockSearchTitleByName,
}));

describe("fetchShowID", () => {
  beforeEach(() => {
    mockSearchTitleByName.mockClear(); // Reset mock before each test
  });

  it("should return correct media object when a show is found", async () => {
    // Mock expected response for "The Boys" with correct types
    mockSearchTitleByName.mockResolvedValue([
      {
        source: {
          sourceId: 'tt1190634',
          sourceType: Source.IMDB,
          sourceUrl: 'https://www.imdb.com/title/tt1190634/'
        },
        name: 'The Boys',
        aka: 'The Boys',
        titleYear: 2019,
        url: 'https://www.imdb.com/title/tt1190634/',
        titleType: 'series' as TitleMainType,
        matchScore: 13,
        thumbnailImageUrl: 'https://m.media-amazon.com/images/M/MV5BMWJlN2U5MzItNjU4My00NTM2LWFjOWUtOWFiNjg3ZTMxZDY1XkEyXkFqcGc@._V1_QL75_UY74_CR5,0,50,74_.jpg'
      },
    ]);

    const result = await fetchShowID("The Boys");
    expect(result).toEqual({
      showID: "tt1190634",
      showyear: 2019,
      showtype: "series",
      showTitle: "The Boys",
      episodes: -1,
      counter: -1,
      status: "",
    });
  });

  it("should return null when no show is found", async () => {
    // Mock when no result is found
    mockSearchTitleByName.mockResolvedValue([]);
    const result = await fetchShowID("NonExistentShow");
    expect(result).toBeNull();
  });
});

describe("statusShow", () => {
  it("should return 'watchlist' if counter is 0", () => {
    const media = { showtype: 'series', showyear: 2019, showTitle: 'The Boys', showID: "tt1190634" ,episodes: 10, counter: 0, status: "" };
    expect(statusShow(media)).toBe("watchlist");
  });

  it("should return 'completed' if counter equals episodes", () => {
    const media = { showtype: 'series', showyear: 2019, showTitle: 'The Boys', showID: "tt1190634" ,episodes: 40, counter: 40, status: "" };
    expect(statusShow(media)).toBe("completed");
  });

  it("should return 'watching' if counter is between 1 and episodes", () => {
    const media = { showtype: 'series', showyear: 2019, showTitle: 'The Boys', showID: "tt1190634" ,episodes: 40, counter: 20, status: "" };
    expect(statusShow(media)).toBe("watching");
  });

  it("should set status to 'completed' if counter exceeds episodes", () => {
    const media = { showtype: 'series', showyear: 2019, showTitle: 'The Boys', showID: "tt1190634" ,episodes: 40, counter: 50, status: "" };
    expect(statusShow(media)).toBe("completed");
    expect(media.counter).toBe(40); // Ensure counter is capped at episodes
  });
});

describe("yourList", () => {
  beforeEach(() => {
    library.length = 0; // Reset library before each test
    jest.clearAllMocks(); // Reset all mocks, including console.log
  });

  it("should correctly filter 'watching' shows", () => {
    library.push(
      { showtype: 'series', showyear: 2019, showID: "tt1190634" , showTitle: "The Boys", status: "watching", counter: 20, episodes: 40 },
    );

    console.log = jest.fn();
    yourList();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Watching:"));
  });
});