import { PublicKey } from "@solana/web3.js";

export const DEFAULT_VALIDATOR_PUBKEY: PublicKey = new PublicKey(
  "dv1ZAGvdsz5hHLwWXsVnM94hWf1pjbKVau1QVkaMJ92", // devnet validator
  // "EARNynHRWg6GfyJCmrrizcZxARB3HVzcaasvNa8kBS72", // mainnet: Solana Compass validator
);

export const DEFAULT_STAKE_AMOUNT: number = 1.0;
