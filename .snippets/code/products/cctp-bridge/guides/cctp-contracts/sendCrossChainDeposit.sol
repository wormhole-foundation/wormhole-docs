function sendCrossChainDeposit(
  uint16 targetChain,
  address targetMintRecipient,
  uint256 amount,
  bytes calldata userPayload
) external returns (uint64 sequence) {
  // pull USDC from user if your pattern needs it (optional)
  // IERC20(usdc).transferFrom(msg.sender, address(this), amount);

  sequence = sendUSDCWithPayload(targetChain, targetMintRecipient, amount, userPayload);
}
