import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { Notification } from "../types/notification";
import apiClient from "./axios";

export const useGetNotifications = (data: object | undefined) =>
  useQuery<Notification[], Error>({
    queryKey: ["notifications", data],
    queryFn: async () => {
      const response = await apiClient("/notifications", "get", data);
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });

export const useGetNotification = (notificationId: number | undefined) =>
  useQuery<Notification[], Error>({
    queryKey: ["notifications", notificationId],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const notificationId = queryKey[1];
      const response = await apiClient(
        `/notifications${notificationId}`,
        "get"
      );
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });
