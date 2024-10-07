export default function isInvalidCart(error) {
  return !!(
    error.graphQLErrors &&
    error.graphQLErrors.find(
      err =>
        err.message.includes('not have an active cart') ||
        err.message.includes('not find a cart with ID') ||
        err.message.includes('Cart not found'),
    )
  );
}
