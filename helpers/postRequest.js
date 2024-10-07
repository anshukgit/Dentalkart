export const postRequest = (url, params, api_key = "") => {
  return fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "x-api-key": api_key,
    }),
    body: JSON.stringify(params),
  });
};
