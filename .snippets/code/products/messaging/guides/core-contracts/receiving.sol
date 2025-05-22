function parseAndVerifyVM(
    bytes calldata encodedVM
) external view returns (VM memory vm, bool valid, string memory reason);
