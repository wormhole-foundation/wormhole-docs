const tx = await receiverContract.setRegisteredSender(
  sourceChain.chainId,
  ethers.zeroPadValue(senderAddress as BytesLike, 32)
);

await tx.wait();
