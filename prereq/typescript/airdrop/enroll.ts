import {
    address,
    appendTransactionMessageInstructions,
    assertIsTransactionWithinSizeLimit,
    createKeyPairSignerFromBytes,
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    createTransactionMessage,
    devnet,
    getSignatureFromTransaction,
    pipe,
    sendAndConfirmTransactionFactory,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signTransactionMessageWithSigners,
    addSignersToTransactionMessage,
    getProgramDerivedAddress,
    generateKeyPairSigner,
    getAddressEncoder
} from "@solana/kit";
const MPL_CORE_PROGRAM = address("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const PROGRAM_ADDRESS = address("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");
const SYSTEM_PROGRAM = address("11111111111111111111111111111111");

import { getInitializeInstruction, getSubmitTsInstruction } from "./clients/js/src/generated/index";

import wallet from './Turbin3-wallet.json'

const LAMPORTS_PER_SOL = BigInt(1_000_000_000)

async function main() {

    const keypair = await createKeyPairSignerFromBytes(new Uint8Array(wallet))

    const rpc = createSolanaRpc("https://api.devnet.solana.com")

    const rpcSubscriptions = createSolanaRpcSubscriptions(devnet("ws://api.devnet.solana.com"))

    const addressEncoder = getAddressEncoder()

    const accountSeeds = [
        Buffer.from("prereqs"),
        addressEncoder.encode(keypair.address)
    ];

    const [account, _bump] = await getProgramDerivedAddress({
        programAddress: PROGRAM_ADDRESS,
        seeds: accountSeeds
    })

    const COLLECTION = address("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2")

    const authoritySeeds = [
        Buffer.from("collection"),
        addressEncoder.encode(COLLECTION)
    ]

    const [authority, _authorityBump] = await getProgramDerivedAddress({
        programAddress: PROGRAM_ADDRESS,
        seeds: authoritySeeds
    })

    const mintKeyPair = await generateKeyPairSigner()
    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })
    
    // const initializeIx = getInitializeInstruction({
    //     github: "code-pankaj",
    //     user: keypair,
    //     account,
    //     systemProgram: SYSTEM_PROGRAM
    // })

    // const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()

    // const transactionMessageInit = pipe(
    //     createTransactionMessage({ version: 0 }),
    //     tx => setTransactionMessageFeePayerSigner(keypair, tx),
    //     tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    //     tx => appendTransactionMessageInstructions([initializeIx], tx)
    // )

    // const signedTxInit = await signTransactionMessageWithSigners(transactionMessageInit)
    // assertIsTransactionWithinSizeLimit(signedTxInit)


    // try {
    //     const result = await sendAndConfirmTransaction(
    //         signedTxInit,
    //         { commitment: 'confirmed', skipPreflight: false }
    //     )
    //     console.log(result)
    //     const signatureInit = getSignatureFromTransaction(signedTxInit)
    //     console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signatureInit}?cluster=devnet`)
    // } catch (error) {
    //     console.error(`Oops!! Something went wrong : ${error}`)
    // }

    const { value: latestBlockhashSubmit } = await rpc.getLatestBlockhash().send()

    const submitIx = getSubmitTsInstruction({
        user: keypair,
        account,
        mint: mintKeyPair,
        collection: COLLECTION,
        authority,
        mplCoreProgram: MPL_CORE_PROGRAM,
        systemProgram: SYSTEM_PROGRAM
    })

    const transactionMessageSubmit = pipe(
        createTransactionMessage({ version: 0 }),
        tx => setTransactionMessageFeePayerSigner(keypair, tx),
        tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhashSubmit, tx),
        tx => appendTransactionMessageInstructions([submitIx], tx),
        tx => addSignersToTransactionMessage([mintKeyPair], tx)
    )

    const signedTxSubmit = await signTransactionMessageWithSigners(transactionMessageSubmit)
    assertIsTransactionWithinSizeLimit(signedTxSubmit)

    try {
        await sendAndConfirmTransaction(
            signedTxSubmit,
            { commitment: 'confirmed', skipPreflight: false }
        )
        const signatureSubmit = getSignatureFromTransaction(signedTxSubmit)
        console.log(`Success! Check out your TX here : https://explorer.solana.com/tx/${signatureSubmit}?cluster=devnet`)
    } catch (error) {
        console.error(`Oops!! Something went wrong : ${error}`)
    }
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})


// Enrollment Transactions
// Init: https://explorer.solana.com/tx/5DmUW6w4TQ9xSCwiWWfvbruM7NBb5s7yLkx7tjvPtbGGCmNtcMTLkEHW5NZoR8URjd7w6EENJmcCrvwDWRegCRJ7?cluster=devnet
// Submit: https://explorer.solana.com/tx/4pbKnfiwbc3LvfFU4eFxPrziZ4zepQrWvcnzuJhEtGKMtjYiV49UXAq62fGkA5mc4qqdLygJnKPkrQNqPfwuZAUe?cluster=devnet