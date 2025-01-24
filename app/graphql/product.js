export const GET_ADJACENT_VARIANTS = `#graphql
  query GetAdjacentVariants($productId: ID!, $selectedOptions: [SelectedOptionInput!]) {
    product(id: $productId) {
      id
      title
      adjacentVariants(selectedOptions: $selectedOptions) {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;
