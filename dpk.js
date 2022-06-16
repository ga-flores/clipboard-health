const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

function createHash(data) {
  return crypto.createHash("sha3-512").update(data).digest("hex");
}

exports.deterministicPartitionKey = (event) => {
  let candidate = TRIVIAL_PARTITION_KEY;

  if (event) {
    if (event.partitionKey) {
      candidate =
        typeof event.partitionKey !== "string"
          ? JSON.stringify(event.partitionKey)
          : event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = createHash(data);
    }
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = createHash(candidate);
  }
  return candidate;
};
