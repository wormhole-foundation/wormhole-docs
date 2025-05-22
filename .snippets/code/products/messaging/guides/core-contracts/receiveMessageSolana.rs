pub fn receive_message(ctx: Context<ReceiveMessage>, vaa_hash: [u8; 32]) -> Result<()> {
    let posted_message = &ctx.accounts.posted;

    if let HelloWorldMessage::Hello { message } = posted_message.data() {
        // Check message
        // Your custom application logic here
        Ok(())
    } else {
        Err(HelloWorldError::InvalidMessage.into())
    }
}
