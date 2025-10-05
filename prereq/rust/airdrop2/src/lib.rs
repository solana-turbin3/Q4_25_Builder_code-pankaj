#[cfg(test)]
mod tests {
    // use solana_sdk::signature::{Keypair, Signer};
    // use bs58;
    // use std::io::{self, BufRead}
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::{
        hash::hash,
        message::Message,
        pubkey::Pubkey,
        signature::{read_keypair_file, Keypair, Signer},
        transaction::Transaction,
    };
    use std::str::FromStr;
    // use solana_system_interface::instruction::transfer;
    use solana_sdk::instruction::{AccountMeta, Instruction};
    use solana_system_interface::{instruction::transfer, program as system_program};

    const RPC_URL: &str =
        "https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a";

    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!("You've generated a new Solana wallet: {}\n", kp.pubkey());
        println!("To save your wallet, copy and paste the following into a JSON file : ");
        println!("{:?}", kp.to_bytes());
    }

    #[test]
    fn claim_airdrop() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file.");

        let client = RpcClient::new(RPC_URL);
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(sig) => {
                println!("Success! Check your TX here : ");
                println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
            }
            Err(err) => {
                println!("Airdrop failed : {}", err);
            }
        }
    }

    #[test]
    fn transfer_sol() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file.");

        // let pubkey = keypair.pubkey();
        // let message_bytes = b"I verify my Solana Keypair!";
        // let sig = keypair.sign_message(message_bytes);

        // let sig_hashed = hash(sig.as_ref());

        // match sig.verify(&pubkey.to_bytes(), & sig_hashed.to_bytes()){
        //     true => println!("Signature verified"),
        //     false => println!("Verification failed"),
        // }

        let to_pubkey = Pubkey::from_str("7pG4ZmadupxDLGDFrTLBCgUxrws3tNri4L4eP4WWBjLn").unwrap();

        let rpc_client = RpcClient::new(RPC_URL);

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let balance = rpc_client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");

        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );

        let fee = rpc_client
            .get_fee_for_message(&message)
            .expect("Failed to get fee calculator");

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send final transaction");

        println!(
            "Success! Check out your TX here : https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    // #[test]
    // fn base58_to_wallet() {
    //     println!("Input your private key as a base58 string: ");
    //     let stdin = io::stdin();
    //     let base58 = stdin.lock().lines().next().unwarp().unwarp();
    //     println!("Your wallet file format is : ");
    //     let wallet = bs58::decode(base58).into_vec().unwrap();
    //     println!("{:?}", wallet);
    // }

    #[test]
    fn submit_rs() {
        let rpc_client = RpcClient::new(RPC_URL);

        // Load your signer keypair
        let keypair = read_keypair_file("Turbin3-wallet.json").expect("Couldn't find wallet file.");
        let signer_pubkey = keypair.pubkey();

        // Define other accounts
        let mint = Keypair::new();
        let turbin3_prereq_program =
            Pubkey::from_str("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM").unwrap();
        let collection = Pubkey::from_str("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2").unwrap();
        let mpl_core_program =
            Pubkey::from_str("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d").unwrap();
        let system_program = system_program::id();

        // Derive prereq PDA
        let seeds = &[b"prereqs", signer_pubkey.as_ref()];
        let (prereq_pda, _bump) = Pubkey::find_program_address(seeds, &turbin3_prereq_program);

        // Derive authority PDA (the missing piece)
        let authority_seeds = &[b"collection".as_ref(), collection.as_ref()];
        let (authority, _authority_bump) =
            Pubkey::find_program_address(authority_seeds, &turbin3_prereq_program);

        // Instruction discriminator for submit_rs
        let data = vec![77, 124, 82, 163, 21, 133, 181, 206];

        // Accounts
        let accounts = vec![
            AccountMeta::new(signer_pubkey, true),       // user signer
            AccountMeta::new(prereq_pda, false),         // PDA account
            AccountMeta::new(mint.pubkey(), true),       // mint
            AccountMeta::new(collection, false),         // collection
            AccountMeta::new_readonly(authority, false), // authority PDA
            AccountMeta::new_readonly(mpl_core_program, false),
            AccountMeta::new_readonly(system_program, false),
        ];

        // Build transaction
        let blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let instruction = Instruction {
            program_id: turbin3_prereq_program,
            accounts,
            data,
        };

        let transaction = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&signer_pubkey),
            &[&keypair, &mint],
            blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here:\nhttps://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }
}


// https://explorer.solana.com/tx/59Tg9eHAEMYov5KLrMFL4kLVZaR6LX22mkaWsVZdybTT2YDga3ohP5tJ1mnZKs2nWzKDsHJsfSKSD3WpKmM5ESMt?cluster=devnet