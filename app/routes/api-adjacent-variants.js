import { errorResponse, noDataResponse } from "~/lib/fetch";
import { GET_ADJACENT_VARIANTS } from "~/graphql/product";

export const URL_ADJACENT_VARIANTS = '/api-adjacent-variants';

export const action = async ({ request, context }) => {
  const formData = await request.formData();
  const productId = formData.get('productId');
  const selectedOptions = JSON.parse(formData.get('selectedOptions'));

  if (!productId || !selectedOptions) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields (productId or selectedOptions)' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const response = await fetch(
    `https://${context.env.PUBLIC_STORE_DOMAIN}/api/${context.env.PUBLIC_STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': context.env.PUBLIC_STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({
        query: GET_ADJACENT_VARIANTS,
        variables: {
          productId,
          selectedOptions
        },
      }),
    }
  );

  if(!response.ok) return errorResponse(response);

  const data = await response.json();

  if(!data) return noDataResponse();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
