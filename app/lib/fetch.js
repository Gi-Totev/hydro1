export function errorResponse(response) {
  return new Response(
    JSON.stringify({ error: `External API error: ${response.statusText}` }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function noDataResponse() {
  return new Response(
    JSON.stringify({ error: 'Invalid data returned from external API' }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
