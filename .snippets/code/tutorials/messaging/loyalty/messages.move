module loyalty_contracts::messages;

use sui::bcs;
use sui::coin::Coin;
use sui::clock::Clock;
use sui::sui::SUI;

use wormhole::vaa::{Self, VAA};
use wormhole::state::State;
use wormhole::publish_message::{Self, MessageTicket};
use wormhole::emitter::EmitterCap;

use loyalty_contracts::loyalty::{Self, LoyaltyData};

const EInvalidPayload: u64 = 404;
const EInexistentOpCode: u64 = 407;

public fun receive_message (
    raw_vaa: vector<u8>,
    wormhole_state: &State,
    clock: &Clock,
    data: &mut LoyaltyData
)
{

    let vaa: VAA = vaa::parse_and_verify(wormhole_state, raw_vaa, clock);
    let payload = vaa::take_payload(vaa);
    let (op, _chain, user, amount) = parse_payload(payload);

    // gain points
    if (op == 0) {
        loyalty::add_points(data, user, amount);
    } 
    // use points
    else if (op == 1) {
       loyalty::remove_points(data, user, amount); 
    } else {
        abort(EInexistentOpCode)
    }

}

// suggested way is to call wormhole::publish_message::publish_message in a PTB
public fun new_message(
    data: &LoyaltyData,
    user: vector<u8>,
    nonce: u32,
    emitter_cap: &mut EmitterCap
): MessageTicket
{
    let payload = prepare_payload(data.points(user), user);
    publish_message::prepare_message(emitter_cap, nonce, payload)
}

// not suggested, useful_for tests
public fun emit_message_(
    wormhole_state: &mut State,
    message_fee: Coin<SUI>,
    clock: &Clock,
    data: &LoyaltyData,
    user: vector<u8>,
    nonce: u32,
    emitter_cap: &mut EmitterCap
) 
{
    let msg_ticket = new_message(data, user, nonce, emitter_cap);
    publish_message::publish_message(wormhole_state, message_fee, msg_ticket, clock);
}

// The emitted messages will contain the points a user has
fun prepare_payload(points: u64, user: vector<u8>): vector<u8> {
    let mut payload: vector<u8> = bcs::to_bytes(&points);
    vector::append(&mut payload, user);
    payload
}


// We expect a payload to be an array of u8 types
// The last element is the operation (spend or consume)
// Then the second to last is a u8 denoting the chain
// Next 32 u8's are the public key
// First 8 are bcs encoded u64 value of the points gained
fun parse_payload(mut payload: vector<u8>): (u8, u8, vector<u8>, u64) {
    let operation = vector::pop_back(&mut payload);
    let chain = vector::pop_back(&mut payload);
    let mut user_address: vector<u8> = vector[];
    let mut i = 0;
    while(i < 32) {
        vector::push_back(&mut user_address, vector::pop_back(&mut payload));
        i = i + 1;
    };
    // we wrote it backwards
    vector::reverse(&mut user_address);
    // We expect 8 u8s in the payload since a u64 encoded in bcs is 8 bytes.
    assert!(vector::length(&payload) == 8, EInvalidPayload);

    let mut amount_bcs = bcs::new(payload);
    let amount = amount_bcs.peel_u64();
    (operation, chain, user_address, amount)
}
