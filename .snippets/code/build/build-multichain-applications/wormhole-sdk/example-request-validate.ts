console.log(
  'This route offers the following default options',
  bestRoute.getDefaultOptions()
);
// Specify the amount as a decimal string
const amt = '0.001';
// Create the transfer params for this request
const transferParams = { amount: amt, options: { nativeGas: 0 } };

// validate the transfer params passed, this returns a new type of ValidatedTransferParams
// which (believe it or not) is a validated version of the input params
// this new var must be passed to the next step, quote
const validated = await bestRoute.validate(transferParams);
if (!validated.valid) throw validated.error;
console.log('Validated parameters: ', validated.params);

// get a quote for the transfer, this too returns a new type that must
// be passed to the next step, execute (if you like the quote)
const quote = await bestRoute.quote(validated.params);
if (!quote.success) throw quote.error;
console.log('Best route quote: ', quote);