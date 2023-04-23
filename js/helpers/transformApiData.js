const transformApiData = (data) => {
  return data.map((item) => {
    return {
      id: item.id,
      type: item.type,
      url: item.attributes.url,
      state: item.attributes.state,
    };
  });
};

export default transformApiData;