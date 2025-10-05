import bs58 from 'bs58'
import wallet from './dev-wallet.json'

function walletBytesToBase58(bytes: any){
    const buffer = Buffer.from(bytes)
    return bs58.encode(buffer)
}

const walletBytes = wallet

console.log(walletBytesToBase58(walletBytes))