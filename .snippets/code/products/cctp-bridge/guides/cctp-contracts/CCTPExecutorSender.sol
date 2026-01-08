// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
  function approve(address spender, uint256 amount) external returns (bool);
}

interface ICircleIntegration {
  struct TransferParameters {
    address token;        
    uint256 amount;       
    uint16 targetChain;   
    bytes32 mintRecipient;
  }

  function transferTokensWithPayload(
    TransferParameters calldata transferParams,
    uint32 batchId,
    bytes calldata payload
  ) external returns (uint64 messageSequence);
}

library AddressToBytes32 {
  function toBytes32(address a) internal pure returns (bytes32) {
    return bytes32(uint256(uint160(a)));
  }
}

contract CCTPExecutorSender {
  using AddressToBytes32 for address;

  IERC20 public immutable usdc;
  ICircleIntegration public immutable circleIntegration;
  uint32 public constant BATCH_ID = 0;

  constructor(address usdc_, address circleIntegration_) {
    usdc = IERC20(usdc_);
    circleIntegration = ICircleIntegration(circleIntegration_);
  }

  function sendUSDCWithPayload(
    uint16 targetChain,
    address targetMintRecipient, 
    uint256 amount,
    bytes calldata userPayload
  ) external returns (uint64 sequence) {
    // Approve Circle Integration to burn USDC
    require(usdc.approve(address(circleIntegration), amount), "approve failed");

    ICircleIntegration.TransferParameters memory tp =
      ICircleIntegration.TransferParameters({
        token: address(usdc),
        amount: amount,
        targetChain: targetChain,
        mintRecipient: targetMintRecipient.toBytes32()
      });

    sequence = circleIntegration.transferTokensWithPayload(tp, BATCH_ID, userPayload);
  }
}
