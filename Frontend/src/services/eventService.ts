import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { Event } from "../types/event";
import apiClient from "./axios";

export const useGetEvents = (data: object | undefined) =>
  useQuery<Event[], Error>({
    queryKey: ["events", data],
    queryFn: async () => {
      const response = await apiClient("/events", "get", data);
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });

export const useGetEvent = (eventId: number | undefined) =>
  useQuery<Event[], Error>({
    queryKey: ["events", eventId],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const eventId = queryKey[1];
      const response = await apiClient(`/events/${eventId}`, "get");
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

export const useGetNotifications = (eventId: number | undefined) =>
  useQuery<Event[], Error>({
    queryKey: ["events", eventId],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const eventId = queryKey[1];
      const response = await apiClient(
        `/events/${eventId}/notification-types`,
        "get"
      );
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });
