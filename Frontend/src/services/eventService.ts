import {
  useQuery,
  QueryFunctionContext,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Event } from "../types/event";
import apiClient from "./axios";

interface ContextType {
  previousEvents: Event[];
}

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
  useQuery<Event, Error>({
    queryKey: ["events", eventId],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const eventId = queryKey[1];
      const response = await apiClient(`/events/${eventId}`, "get");
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

export const useGetNotifications = (eventId: string | undefined) =>
  useQuery<Notification[], Error>({
    queryKey: ["notifications", eventId, "events"],
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

export const useAddEvents = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Event, Error, Event, ContextType>({
    mutationFn: async (event: Event) => {
      const response = await apiClient(`/events`, "post", event);
      return response.data;
    },
    onSuccess: (savedEvents) => {
      const previousEvents = queryClient.getQueryData<Event[]>(["events"]);
      queryClient.setQueryData<Event[] | undefined>(
        ["events", applicationId, "applications"],
        (events) => {
          if (events) {
            return [savedEvents, ...events];
          }
          return [savedEvents];
        }
      );
      return { previousEvents };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Event[]>(
        ["events", applicationId, "applications"],
        context?.previousEvents
      );
    },
  });
};

export const useUpdateEvents = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Event, Error, Event, ContextType>({
    mutationFn: async (event: Event) => {
      const response = await apiClient(`/events/${event._id}`, "patch", event);
      return response.data;
    },
    onSuccess: (savedEvents) => {
      const previousEvents = queryClient.getQueryData<Event[]>(["events"]);
      queryClient.setQueryData<Event[] | undefined>(
        ["events", applicationId, "applications"],
        (events) => {
          if (events) {
            return [savedEvents, ...events];
          }
          return [savedEvents];
        }
      );
      return { previousEvents };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Event[]>(
        ["events", applicationId, "applications"],
        context?.previousEvents
      );
    },
  });
};

export const useDeleteEvents = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Event, Error, string[], ContextType>({
    mutationFn: async (data: string[]) => {
      const response = await apiClient(`/events`, "delete", data);
      return response.data;
    },
    onSuccess: (savedEvents) => {
      const previousEvents = queryClient.getQueryData<Event[]>(["events"]);
      queryClient.setQueryData<Event[] | undefined>(
        ["events", applicationId, "applications"],
        (events) => {
          if (events) {
            return [savedEvents, ...events];
          }
          return [savedEvents];
        }
      );
      return { previousEvents };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Event[]>(
        ["events", applicationId, "applications"],
        context?.previousEvents
      );
    },
  });
};
