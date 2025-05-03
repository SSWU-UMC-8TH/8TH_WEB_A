import { useEffect, useState, ReactNode } from 'react';
import axios from 'axios';


interface UseCustomFetchResult<T> {
  data: T | null;
  statusUI: ReactNode;
}

export function useCustomFetch<T>(url: string): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });
        setData(res.data);
      } catch (err) {
        setError('죄송합니다. 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  let statusUI: ReactNode = null;

  if (loading) {
    statusUI = (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  } else if (error) {
    statusUI = (
      <div className="text-center text-red-500 bg-red-100 border border-red-300 p-4 rounded-md max-w-md mx-auto mt-10 shadow-md">
        <p className="text-lg font-semibold">죄송합니다. 에러가 발생하였습니다.</p>
        <p>{error}</p>
      </div>
    );
  }

  return { data, statusUI };
}

