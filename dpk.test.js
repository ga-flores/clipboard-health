const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the `partitionKey` in `event` if it exists", () => {
    const { deterministicPartitionKey } = require("./dpk");
    const trivialKey = deterministicPartitionKey({ partitionKey: "clipboard" });
    expect(trivialKey).toBe("clipboard");
  });

  it("Uses the event itself to generate the key if `partitionKey` is not in the event", () => {
    const trivialKey = deterministicPartitionKey({ clipboard: "health" });
    expect(trivialKey).toBe("151e60f3f9a766f028ec1e03806c617627ebe697433afee03d307ff68f47e8705dbcaa782801a630bd512988d57e2e9591c4373e4045d34b811ac079d745d157");
  });

  it("Stringifies `partitionKey` if it's not a string", () => {
    const { deterministicPartitionKey } = require("./dpk");
    const trivialKey = deterministicPartitionKey({ partitionKey: 1234 });
    expect(trivialKey).toBe("1234");
  });

  it("Compresses a key longer than 256 characters", () => {
    const { deterministicPartitionKey } = require("./dpk");
    const LONG_KEY = Array(300).fill("a").join("");
    const trivialKey = deterministicPartitionKey({ partitionKey: LONG_KEY });
    expect(trivialKey.length).toBe(128);
  });
});
