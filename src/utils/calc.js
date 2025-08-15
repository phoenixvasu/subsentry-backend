export function calcAnnualizedCost(cost, cycle) {
  const c = Number(cost);
  switch (cycle) {
    case 'Monthly':
      return +(c * 12).toFixed(2);
    case 'Quarterly':
      return +(c * 4).toFixed(2);
    case 'Yearly':
      return +c.toFixed(2);
    default:
      throw new Error('Invalid billing cycle');
  }
}
