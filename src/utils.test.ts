import readline from 'readline';
import { mocked } from 'ts-jest/utils';
import * as U from "./utils";
import * as T from "./type";

test("get subdomain", () => {
  expect(U.getSubdomain(T.Env.dev)).toEqual("dev");
  expect(U.getSubdomain(T.Env.test)).toEqual("test");
  expect(U.getSubdomain(T.Env.prod)).toEqual("app");
});

test("get domain", () => {
  expect(U.getHost(T.Env.dev, "nexys", "io")).toEqual("https://dev.nexys.io");
});



// Mock readline module
jest.mock('readline');

const mockQuestion = jest.fn();
const mockClose = jest.fn();

// Setup the mocked readline.createInterface function to return our mocked functions
mocked(readline.createInterface).mockReturnValue({
  question: mockQuestion,
  close: mockClose,
} as any);

describe('askForConfirmation', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockQuestion.mockClear();
    mockClose.mockClear();
  });

  it('should return true for "yes" answer', async () => {
    // Mock the user input as "yes"
    mockQuestion.mockImplementation((_, callback) => callback('yes'));
    
    const result = await U.askForConfirmation();
    expect(result).toBe(true);
  });

  it('should return false for "no" answer', async () => {
    // Mock the user input as "no"
    mockQuestion.mockImplementation((_, callback) => callback('no'));
    
    const result = await askForConfirmation();
    expect(result).toBe(false);
  });

  it('should close readline interface after getting answer', async () => {
    mockQuestion.mockImplementation((_, callback) => callback('yes'));
    
    await askForConfirmation();
    expect(mockClose).toHaveBeenCalled();
  });

  it('should create a new readline interface for each call', async () => {
    // Mock the user input as "yes" twice
    mockQuestion.mockImplementationOnce((_, callback) => callback('yes'))
                .mockImplementationOnce((_, callback) => callback('yes'));

    await askForConfirmation();
    await askForConfirmation();

    // Expect readline.createInterface to have been called twice
    expect(readline.createInterface).toHaveBeenCalledTimes(2);
  });
});
