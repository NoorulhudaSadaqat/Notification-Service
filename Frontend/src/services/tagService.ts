import { useQuery } from "@tanstack/react-query";
import apiClient from "./axios";

interface Itags {
  tags: string[];
  totalCount: number;
}
export const useGetTags = () =>
  useQuery<Itags, Error>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await apiClient("/tags", "get");
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });
