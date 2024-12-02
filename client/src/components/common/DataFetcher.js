import React, { useState, useEffect } from 'react';

const DataFetcher = ({ endpoint, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint); 
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return children(data); 
};

export default DataFetcher;
