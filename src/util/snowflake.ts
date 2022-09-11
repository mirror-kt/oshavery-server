// This file is ported from nodejs-snowflake to Deno.
// https://github.com/utkarsh-pro/nodejs-snowflake/blob/master/src/lib.rs

// GLOBAL CONSTANTS

/**
 * TOTAL_BITS is the total number of bits that
 * the ID can have.
 */
const TOTAL_BITS = 64;

/**
 * EPOCH_BITS is the total number of bits that
 * are occupied by the UNIX timestamp.
 */
const EPOCH_BITS = 42;

/**
 * INSTANCE_ID_BITS is the total number of bits that
 * are occupied by the node id.
 */
const INSTANCE_ID_BITS = 12;

/**
 * SEQUENCE_BITS is the total number of bits that
 * are occupied by the sequence ids.
 */
const SEQUENCE_BITS = 10;

const MAX_INSTANCE_ID = (1 << INSTANCE_ID_BITS) - 1;
const MAX_SEQUENCE = (1 << SEQUENCE_BITS) - 1;

export class SnowflakeOptions {
  constructor(
    public readonly customEpoch: number | null,
    public readonly instanceId: number | null,
  ) {
  }
}

export class Snowflake {
  private constructor(
    private lastTimestamp: number,
    public readonly customEpoch: number,
    private sequence: number,
    public readonly instanceId: number,
  ) {
  }

  static generate(opts: SnowflakeOptions | undefined = undefined): Snowflake {
    if (opts !== undefined) {
      const epoch = opts.customEpoch ?? currentTime(0);
      const instanceId = opts.instanceId ?? random(MAX_INSTANCE_ID);

      if (instanceId > MAX_INSTANCE_ID) {
        throw RangeError(
          `instance_id must be between 0 and ${MAX_INSTANCE_ID}`,
        );
      }

      return new Snowflake(
        0,
        epoch,
        0,
        instanceId & MAX_INSTANCE_ID,
      );
    } else {
      return new Snowflake(
        0,
        currentTime(0),
        0,
        random(MAX_INSTANCE_ID),
      );
    }
  }

  /**
   * getUniqueID generates a 64-bit unique ID.
   *
   * NOTE: This method is blocking in nature, the function also
   * has theoretical limit of generating 1,024,000 IDs/sec.
   */
  getUniqueID(): number {
    let currentTimestamp = currentTime(this.customEpoch);

    if (currentTimestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & MAX_SEQUENCE;

      // If we have exhausted all the sequence number as well
      if (this.sequence === 0) {
        // Wait for roughly a millisecond
        while (currentTime(this.customEpoch) - currentTimestamp < 1) {
          // do nothing, only wait
        }
        // Update timestamp by one
        currentTimestamp += 1;
      }
    } else {
      // Reset the sequence;
      this.sequence = 0;
    }

    this.lastTimestamp = currentTimestamp;

    let id = currentTimestamp << (TOTAL_BITS - EPOCH_BITS);
    id |= this.instanceId << (TOTAL_BITS - EPOCH_BITS - INSTANCE_ID_BITS);
    id |= this.sequence;

    return id;
  }

  /**
   * idFromTimestamp takes a UNIX timestamp without any offset
   * and returns an ID that has timestamp set to the given timestamp.
   *
   * @param timestamp a UNIX timestamp
   */
  idFromTimestamp(timestamp: number): number {
    const fixedTimestamp = Math.round(timestamp) - this.customEpoch;

    let id = fixedTimestamp << (TOTAL_BITS - EPOCH_BITS);
    id |= this.instanceId << (TOTAL_BITS - EPOCH_BITS - INSTANCE_ID_BITS);

    return id;
  }
}

function currentTime(adjust: number): number {
  return Math.round(Date.now()) - adjust;
}

function random(scale: number): number {
  return Math.round(Math.random() * scale);
}
