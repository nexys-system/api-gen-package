import readline from 'readline';
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

jest.mock('readline');

describe('askForConfirmation', () => {
  let mockQuestion: jest.Mock;

  beforeEach(() => {
    mockQuestion = jest.fn();
    (readline.createInterface as jest.Mock).mockReturnValue({
      question: mockQuestion,
      close: jest.fn(),
    });
  });

  it('should resolve to true when user answers "yes"', async () => {
    mockQuestion.mockImplementationOnce((_, callback) => callback('yes'));

    const result = await U.askForConfirmation();

    expect(result).toBe(true);
  });

  it('should resolve to false when user answers "no"', async () => {
    mockQuestion.mockImplementationOnce((_, callback) => callback('no'));

    const result = await U.askForConfirmation();

    expect(result).toBe(false);
  });

  // Additional test to handle varied user input
  it('should resolve to true when user answers "YES" (case insensitive)', async () => {
    mockQuestion.mockImplementationOnce((_, callback) => callback('YES'));

    const result = await U.askForConfirmation();

    expect(result).toBe(true);
  });
});
