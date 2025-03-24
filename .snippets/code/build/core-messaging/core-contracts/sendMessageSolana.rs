let fee = ctx.accounts.wormhole_bridge.fee();
// ... Check fee and send parameters

let config = &ctx.accounts.config;
let payload: Vec<u8> = HelloWorldMessage::Hello { message }.try_to_vec()?;

// Invoke `wormhole::post_message`.
wormhole::post_message(
    CpiContext::new_with_signer(
        ctx.accounts.wormhole_program.to_account_info(),
        wormhole::PostMessage {
            // ... Set fields
        },
        &[
            // ... Set seeds
        ],
    ),
    config.batch_id,
    payload,
    config.finality.into(),
)?;