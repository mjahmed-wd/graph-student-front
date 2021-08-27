export const queryFetch = (graphQuery) => {
    return fetch("https://graph-student-mjahmed.herokuapp.com/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `${graphQuery}`,
      }),
    }).then(res=>res.json())
  };