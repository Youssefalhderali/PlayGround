export const requests = [];

export const requestById = Object.fromEntries(requests.map((request) => [request.id, request]));

export const requestCounts = () =>
  requests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {});
