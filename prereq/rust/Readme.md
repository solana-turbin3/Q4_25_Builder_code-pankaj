# Turbin3 Rust Prerequisites

This project contains the Rust implementation of the **Turbin3 Prerequisites**.  
It mirrors the TypeScript tasks but uses the `solana-sdk` and `solana-client` crates instead.

## What this project does

We built several test functions (`#[test]`) to demonstrate fundamental Solana concepts and finally prove completion of the Turbin3 prerequisites on-chain:

1. **Keygen (`keygen`)**  
   Generates a new Solana `Keypair` and prints its public key and private key bytes.  
   The private key bytes can be saved into a JSON file (`dev-wallet.json`) for reuse.

2. **Airdrop (`claim_airdrop`)**  
   Requests 2 SOL from the Solana **Devnet** faucet and credits it to your dev wallet.

3. **Transfer SOL (`transfer_sol`)**  
   Transfers all lamports from your dev wallet to another wallet (e.g., your Turbin3 wallet), calculating and subtracting fees properly.

4. **Submit Rust Proof (`submit_rs`)**  
   This is the main prerequisite task. It sends a transaction to the **Turbin3 Prereq Program** on Devnet:
   - Derives the **prereq PDA** from seeds `["prereqs", user_pubkey]`.
   - Derives the **authority PDA** from seeds `["collection", collection_pubkey]`.
   - Uses the `submit_rs` instruction discriminator `[77, 124, 82, 163, 21, 133, 181, 206]`.
   - Passes the required accounts:
     - User signer
     - Prereq PDA
     - Mint (new keypair)
     - Collection
     - Authority PDA
     - Metaplex Core Program
     - System Program
   - Signs with both the user keypair and the mint keypair.
   - Sends the transaction and prints the Devnet Explorer link for verification.

## Key Concepts Learned

- **Keypairs and wallets**: Creating, saving, and reusing Solana keypairs.  
- **Airdrops**: Funding your dev wallet with SOL from the faucet.  
- **Transfers**: Sending SOL, handling balances, and fee estimation.  
- **Program Derived Addresses (PDAs)**: Generating deterministic addresses with seeds for secure program-owned accounts.  
- **Instruction construction**: Sending raw instructions to an on-chain Solana program.  
- **Final Submission**: Proving completion of the prerequisites by interacting with the Turbin3 enrollment dApp on-chain.

## How to Run

Run any of the tests with:

```bash
cargo test keygen -- --show-output
cargo test claim_airdrop -- --show-output
cargo test transfer_sol -- --show-output
cargo test submit_rs -- --show-output