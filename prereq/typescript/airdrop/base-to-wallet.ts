import bs58 from 'bs58'

function base58ToWalletBytes(base58Str: string): number[] {
  const buffer = bs58.decode(base58Str)
  return Array.from(buffer)
}

const wallet = "random-string"

const base58Wallet = wallet
const walletBytes = base58ToWalletBytes(base58Wallet)

console.log("Wallet Bytes:", walletBytes)