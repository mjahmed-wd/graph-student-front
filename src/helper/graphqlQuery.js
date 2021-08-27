export const queryFetch = (graphQuery) => {
    return fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `${graphQuery}`,
      }),
    }).then(res=>res.json())
  };