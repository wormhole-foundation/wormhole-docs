#[allow(implicit_const_copy)]
module loyalty_contracts::loyalty;

use sui::table::{Self, Table};

// errors
const EInexistentUser: u64 = 1;
const EWrongSigner: u64 = 2;


public struct LoyaltyData has key {
    id: UID,
    user_points: Table<vector<u8>, u64>,
    admin_address: address,
}

fun init(ctx: &mut TxContext) {
    let data = LoyaltyData {
        id: object::new(ctx),
        user_points: table::new<vector<u8>, u64>(ctx),
        admin_address: ctx.sender(),
    };
    transfer::share_object(data);
}

public fun change_admin_address(
    data: &mut LoyaltyData,
    new_admin: address,
    ctx: &mut TxContext,
) {
    assert!(ctx.sender() == data.admin_address, EWrongSigner);
    data.admin_address = new_admin;
}


public(package) fun add_points(
    data: &mut LoyaltyData,
    user: vector<u8>,
    loyalty_points: u64,
) {
    if (loyalty_points > 0) {
        if(data.user_points.contains(user)) {
            *data.user_points.borrow_mut(user) = *data.user_points.borrow(user) + loyalty_points;
        } else {
            data.user_points.add(user, loyalty_points);
        };
    };
}

public(package) fun remove_points(
    data: &mut LoyaltyData,
    user: vector<u8>,
    loyalty_points: u64,
) {
    assert!(data.user_points.contains(user), EInexistentUser);
    let current_points = *data.user_points.borrow(user);
    if(current_points > loyalty_points) {
        *data.user_points.borrow_mut(user) = current_points - loyalty_points;
    } else {
        *data.user_points.borrow_mut(user) = 0;
    };
}

// getters

public fun points(data: &LoyaltyData, user: vector<u8>): u64 {
    *data.user_points.borrow(user)
}


#[test_only]
public fun init_for_tests(ctx: &mut TxContext) {
    init(ctx);
}
