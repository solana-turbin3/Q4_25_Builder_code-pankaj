#![allow(unused_imports)]

use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        close_account, transfer_checked, CloseAccount, Mint, TokenAccount, TokenInterface,
        TransferChecked,
    },
};

use crate::Escrow;

// #[derive(Accounts)]
// pub struct Take<'info> {
//      TODO: Implement Take Accounts
// }

// impl<'info> Take<'info> {
//      TODO: Implement Take Instruction
//      Includes Deposit, Withdraw and Close Vault
// }
