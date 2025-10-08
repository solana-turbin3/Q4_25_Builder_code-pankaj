import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import mintAccount from "../mint-authority-wallet.json"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("EjFfzGTocyLbiGrAX5K1umdr5RVyvKjrc2rjYUykj8i4")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const mintAuthority = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(mintAccount))
const signer = createSignerFromKeypair(umi, mintAuthority);
umi.use(signerIdentity(createSignerFromKeypair(umi, mintAuthority)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority : signer,
        }

        let data: DataV2Args = {
            name: "Realm",
            symbol: "RLM", 
            uri: "https://jew4yhqbd4mylmv3fvwl6lm54hfufeqcmyuyzv5ps5mxld4clyba.arweave.net/SS3MHgEfGYWyuy1svy2d4ctCkgJmKYzXr5dZdY-CXgI",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
