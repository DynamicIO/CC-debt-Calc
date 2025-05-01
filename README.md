# Credit Card Debt Calculator

A web-based calculator that helps users understand their credit card debt repayment options and timelines.

## Features

- Calculate debt repayment timeline based on:
  - Total debt amount
  - Annual Percentage Rate (APR)
  - Monthly payment amount
- View total interest paid and total amount paid
- Compare different debt repayment strategies:
  - Snowball Method (paying off smallest debts first)
  - Avalanche Method (paying off highest APR first)

## How to Use

1. Open `index.html` in your web browser
2. Enter your:
   - Total debt amount
   - Annual Percentage Rate (APR)
   - Monthly payment amount
3. Click "Calculate" to see your repayment timeline and alternative strategies

## Technical Details

The calculator uses the following formula to calculate monthly interest:
```
Monthly Interest = Remaining Balance × (APR ÷ 12 ÷ 100)
```

The repayment plan is calculated by:
1. Applying the monthly payment to the interest first
2. Using the remaining payment amount to reduce the principal
3. Repeating until the debt is paid off

## Future Improvements

- Add support for multiple credit cards with different balances and APRs
- Include a payment schedule visualization
- Add the ability to save and compare different scenarios
- Implement a minimum payment calculator
- Add more debt repayment strategies

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- No external dependencies required 