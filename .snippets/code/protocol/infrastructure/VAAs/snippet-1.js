// hash the bytes of the body twice
digest = keccak256(keccak256(body))
// sign the result 
signature = ecdsa_sign(digest, key)