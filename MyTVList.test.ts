import { media, clear, prompt, fetchShowID, library, main, active, statusShow, yourList } from './main';
import { searchTitleByName as Nameu } from "movier";

// Mock the prompt function to simulate user input
jest.mock("prompt-sync", () => {
  return () => jest.fn();
});

// Mock the fetchShowID function to return a predefined show
jest.mock('./main', () => ({
  ...jest.requireActual('./main'),
  fetchShowID: jest.fn(),
}));

describe('Show/Movies adding', () => {
  beforeEach(() => {
    // Clear the library before each test
    library.length = 0;
  });

  test('Show added and marked as completed', async () => {
    // Mock the fetchShowID function to return a predefined show
    (fetchShowID as jest.Mock).mockResolvedValue({
      showID: '1',
      showTitle: 'Breaking Bad',
      showyear: 2008,
      showtype: 'series',
      episodes: 62,
      counter: 62,
      status: 'completed',
    });

    // Mock the prompt function to simulate user input
    const mockPrompt = require("prompt-sync")();
    mockPrompt.mockReturnValueOnce("1"); // Choose "Add show"
    mockPrompt.mockReturnValueOnce("Breaking Bad"); // Search for "Breaking Bad"
    mockPrompt.mockReturnValueOnce("62"); // Number of episodes
    mockPrompt.mockReturnValueOnce("62"); // Episodes watched

    // Run the main function to simulate user interaction
    await main();

    // Check if the show was added to the library and marked as completed
    const addedShow = library.find(show => show.showTitle === 'Breaking Bad');
    expect(addedShow).toBeDefined();
    expect(addedShow?.status).toBe('completed');
    expect(addedShow?.counter).toBe(62);
    expect(addedShow?.episodes).toBe(62);
  });
});