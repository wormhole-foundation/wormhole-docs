declare_program!(wormhole_post_message_shim);

use anchor_lang::prelude::*;

use wormhole_post_message_shim::{program::WormholePostMessageShim, types::Finality};
use wormhole_solana_consts::{
    CORE_BRIDGE_CONFIG, CORE_BRIDGE_FEE_COLLECTOR, CORE_BRIDGE_PROGRAM_ID,
};

#[derive(Accounts)]
pub struct PostMessage<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    wormhole_post_message_shim: Program<'info, WormholePostMessageShim>,

    #[account(mut, address = CORE_BRIDGE_CONFIG)]
    // post_message requires this account be mutable.
    pub bridge: UncheckedAccount<'info>,

    #[account(mut, seeds = [&emitter.key.to_bytes()], bump, seeds::program = wormhole_post_message_shim::ID)]
    // post_message requires this account be signer and mutable.
    pub message: UncheckedAccount<'info>,

    #[account(seeds = [b"emitter"], bump)]
    /// Our emitter
    pub emitter: UncheckedAccount<'info>,

    #[account(mut)]
    /// post_message` requires this account be mutable.
    /// Explicitly do not re-derive this account. The core bridge verifies the derivation 
    /// and as of Anchor 0.30.1, auto-derivation for other accounts via IDL doesn't work.
    pub sequence: UncheckedAccount<'info>,

    #[account(mut, address = CORE_BRIDGE_FEE_COLLECTOR)]
    /// wormhole::post_message requires this account be mutable.
    pub fee_collector: UncheckedAccount<'info>,

    pub clock: Sysvar<'info, Clock>,

    pub system_program: Program<'info, System>,

    #[account(address = CORE_BRIDGE_PROGRAM_ID)]
    pub wormhole_program: UncheckedAccount<'info>,

    /// Shim event authority
    pub wormhole_post_message_shim_ea: UncheckedAccount<'info>,
}

pub fn post_message(ctx: Context<PostMessage>) -> Result<()> {
    // post_message may require that a fee be sent to the fee_collector account.
    // The following code could be used to handle this via CPI call. However, 
    // this example handles this complexity on the client side using a `preInstruction`
    //
    // let fee = ctx.accounts.wormhole_bridge.fee();
    // if fee > 0 {
    //     solana_program::program::invoke(
    //         &solana_program::system_instruction::transfer(
    //             &ctx.accounts.payer.key(),
    //             &ctx.accounts.fee_collector.key(),
    //             fee,
    //         ),
    //         &ctx.accounts.to_account_infos(),
    //     )?;
    // }

    wormhole_post_message_shim::cpi::post_message(
        CpiContext::new_with_signer(
            ctx.accounts.wormhole_post_message_shim.to_account_info(),
            wormhole_post_message_shim::cpi::accounts::PostMessage {
                payer: ctx.accounts.payer.to_account_info(),
                bridge: ctx.accounts.bridge.to_account_info(),
                message: ctx.accounts.message.to_account_info(),
                emitter: ctx.accounts.emitter.to_account_info(),
                sequence: ctx.accounts.sequence.to_account_info(),
                fee_collector: ctx.accounts.fee_collector.to_account_info(),
                clock: ctx.accounts.clock.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                wormhole_program: ctx.accounts.wormhole_program.to_account_info(),
                program: ctx.accounts.wormhole_post_message_shim.to_account_info(),
                event_authority: ctx.accounts.wormhole_post_message_shim_ea.to_account_info(),
            },
            &[&[b"emitter", &[ctx.bumps.emitter]]],
        ),
        0,
        Finality::Finalized,
        b"your message goes here!".to_vec(),
    )?;

    Ok(())
}