import {
  useQuery,
  QueryFunctionContext,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Event, EventResult } from "../types/event";
import apiClient from "./axios";
import { NotificationResult } from "../types/notification";

interface ContextType {
  previousEvents: Event[];
}
export const useGetEvents = (data: object | undefined) =>
  useQuery<EventResult[], Error>({
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

export const useGetNotifications = (
  eventId: string | undefined,
  data: object | undefined
) =>
  useQuery<NotificationResult, Error>({
    queryKey: ["notifications", eventId, "events", data],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const eventId = queryKey[1];
      const response = await apiClient(
        `/events/${eventId}/notification-types`,
        "get",
        data
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
    onSettled: () => {
      queryClient.invalidateQueries(["events", applicationId, "applications"]);
    },
    // onSuccess: (savedEvents) => {
    //   const previousEvents = queryClient.getQueryData<Event[]>(["events"]);
    //   queryClient.setQueryData<Event[] | undefined>(
    //     ["events", applicationId, "applications"],
    //     (events) => {
    //       if (events) {
    //         return [savedEvents, ...events];
    //       }
    //       return [savedEvents];
    //     }
    //   );
    //   return { previousEvents };
    // },
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
      const id = event._id;
      delete event._id;
      const response = await apiClient(`/events/${id}`, "patch", event);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events", applicationId, "applications"]);
    },
    // onSuccess: (savedEvents) => {
    //   const previousEvents = queryClient.getQueryData<Event[]>(["events"]);
    //   queryClient.setQueryData<Event[] | undefined>(
    //     ["events", applicationId, "applications"],
    //     (events) => {
    //       if (events) {
    //         const updatedEvents = [savedEvents, ...events];
    //         const uniqueEventIds = new Map();
    //         const filteredEvents = updatedEvents.filter((event) => {
    //           if (uniqueEventIds.has(event._id)) {
    //             return false;
    //           } else {
    //             uniqueEventIds.set(event._id, true);
    //             return true;
    //           }
    //         });
    //         return filteredEvents;
    //       }
    //       return [savedEvents];
    //     }
    //   );
    //   return { previousEvents };
    // },
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
      const response = await apiClient(`/events`, "delete", {
        eventIds: data,
      });
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events", applicationId, "applications"]);
    },
    // onSuccess: (savedEvents) => {
    //   const previousEvents = queryClient.getQueryData<Event[]>(["events"]);
    //   queryClient.setQueryData<Event[] | undefined>(
    //     ["events", applicationId, "applications"],
    //     (events) => {
    //       if (events) {
    //         return [savedEvents, ...events];
    //       }
    //       return [savedEvents];
    //     }
    //   );
    //   return { previousEvents };
    // },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Event[]>(
        ["events", applicationId, "applications"],
        context?.previousEvents
      );
    },
  });
};
