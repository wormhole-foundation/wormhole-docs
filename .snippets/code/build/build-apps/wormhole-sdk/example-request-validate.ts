console.log(
  'This route offers the following default options',
  bestRoute.getDefaultOptions()
);

const amt = '0.001';

const transferParams = { amount: amt, options: { nativeGas: 0 } };

// Validate the transfer params passed
const validated = await bestRoute.validate(transferParams);
if (!validated.valid) throw validated.error;
console.log('Validated parameters: ', validated.params);

// Get a quote for the transfer
const quote = await bestRoute.quote(validated.params);
if (!quote.success) throw quote.error;
console.log('Best route quote: ', quote);