import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"
import mintAccount from "../mint-authority-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const mintAuthority = Keypair.fromSecretKey(new Uint8Array(mintAccount))

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;
const amount = 100n * token_decimals

// Mint address
const mint = new PublicKey("EjFfzGTocyLbiGrAX5K1umdr5RVyvKjrc2rjYUykj8i4");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            mintAuthority,
            amount
        )
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


// Your ata is: 8rXUJqECV8uANW4hqTaySd42f9kZHXrxbkJg2n1FjxsR
// Your mint txid: cgmnDgiVdmBqyyAJU51cfBz2o3q4NwRBtoPf5GbCYKjsRNtV3rD3GqUjWqzES4RfBZXnJQWqgSBeEio511WC1Zy