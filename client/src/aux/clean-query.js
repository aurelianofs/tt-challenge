const cleanQuery = query => {
  const cleaned = {};

  for (const key in query) {
    if(!!query[key]) cleaned[key] = query[key];
  }

  return cleaned;
};

export default cleanQuery;
