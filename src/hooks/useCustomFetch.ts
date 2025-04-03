import { useEffect, useState } from "react";
import axios from "axios";

interface ApiResponse<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

type Language = "ko-KR" | "en-US" ;

function useCustomFetch<T>(url:string, language: Language="en-US"): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);

      try {
        const { data } = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
          params: {
            language,
          }
        });
        setData(data); // 성공적으로 데이터를 가져온 경우
      } catch { // 에러가 발생한 경우
        setIsError(true);
      } finally { // 항상 실행되는 애
        setIsPending(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, isPending, isError };
}

export default useCustomFetch;