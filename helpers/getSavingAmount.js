const getSavingAmount = (subtotal) => {
  const MAX_DISCOUNT_PERCENTILE = 5;
  const USER_REWARD_MUL_FACTOR = 2;
  const MEMBER_USER_REWARD_MUL_FACTOR = 1;

  // 5 percent of subtotal
  const DISCOUNT_AMOUNT = (MAX_DISCOUNT_PERCENTILE / 100) * subtotal;

  // max point required to apply discount for normal user
  const USER_REQUIRED_PNT = DISCOUNT_AMOUNT * USER_REWARD_MUL_FACTOR;

  //max point required to apply discount for member user
  const MEMBER_USER_REQUIRED_POINT =
    DISCOUNT_AMOUNT * MEMBER_USER_REWARD_MUL_FACTOR;

  // saving in terms of points
  const SAVING_AMOUNT =
    (USER_REQUIRED_PNT - MEMBER_USER_REQUIRED_POINT) / USER_REWARD_MUL_FACTOR;

  return SAVING_AMOUNT;
};
export default getSavingAmount;