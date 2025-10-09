import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../turbin3-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = createNft(umi, {
        mint,
        name: "AceRUG",
        symbol: "ACE",
        uri: "https://gateway.irys.xyz/4JqrptF9FXMwGoPvE8KWWMvpHeqwhNrz9nsHoKmEjSJF",
        sellerFeeBasisPoints: percentAmount(5)
    })
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();


// Succesfully Minted! Check out your TX here:
// https://explorer.solana.com/tx/bUeuwHSYFGuvPH9rt5BxkE7VuyFh1ov9idbrh1tbewFmdakNhkkNHWWtzDrxPtdUn3YVgmdDv2dqMSEEpKZogyd?cluster=devnet
// Mint Address:  8DUa1nEhaNyzk8ivxPYQwE8qtoufbits8wt4EcWQJpEL