const tx = await MessageSender.sendMessage(targetChain, targetAddress, message, {
    value: txCost,
  });  