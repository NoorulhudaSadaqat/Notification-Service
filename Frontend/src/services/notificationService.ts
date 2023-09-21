import {
  useQuery,
  QueryFunctionContext,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { Notification, NotificationResult } from "../types/notification";
import apiClient from "./axios";

interface ContextType {
  previousNotifications: Notification[];
}

export const useGetNotifications = (data: object | undefined) =>
  useQuery<NotificationResult, Error>({
    queryKey: ["notifications", data],
    queryFn: async () => {
      const response = await apiClient("/notification-types", "get", data);
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });

export const useGetNotification = (notificationId: string | undefined) =>
  useQuery<Notification, Error>({
    queryKey: ["notifications", notificationId],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const notificationId = queryKey[1];
      const response = await apiClient(
        `/notification-types/${notificationId}`,
        "get"
      );
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

export const useAddNotification = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Notification, Error, Notification, ContextType>({
    mutationFn: async (notification: Notification) => {
      const response = await apiClient(
        `/notification-types`,
        "post",
        notification
      );
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(["notifications", eventId, "events", {}]);
    },
    // onSuccess: (savedNotifications) => {
    //   const previousNotifications = queryClient.getQueryData<Notification[]>([
    //     "notifications",
    //     eventId,
    //     "events",
    //   ]);
    //   queryClient.setQueryData<Notification[] | undefined>(
    //     ["notifications", eventId, "events"],

    //     (notifications) => {
    //       if (notifications) {
    //         return [savedNotifications, ...notifications];
    //       }
    //       return [savedNotifications];
    //     }
    //   );
    //   return { previousNotifications };
    // },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Notification[]>(
        ["notifications", eventId, "events"],

        context?.previousNotifications
      );
    },
  });
};

export const useUpdateNotification = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Notification, Error, Notification, ContextType>({
    mutationFn: async (notification: Notification) => {
      const id = notification._id;
      delete notification._id;
      const response = await apiClient(
        `/notification-types/${id}`,
        "patch",
        notification
      );
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(["notifications", eventId, "events", {}]);
    },
    // onSuccess: (savedNotifications) => {
    //   const previousNotifications = queryClient.getQueryData<Notification[]>([
    //     "notifications",
    //     eventId,
    //     "events",
    //   ]);
    //   queryClient.setQueryData<Notification[] | undefined>(
    //     ["notifications", eventId, "events"],
    //     (notifications) => {
    //       if (notifications) {
    //         const updatedNotifications = [savedNotifications, ...notifications];
    //         const uniqueNotificationIds = new Map();
    //         const filteredNotifications = updatedNotifications.filter(
    //           (notification) => {
    //             if (uniqueNotificationIds.has(notification._id)) {
    //               return false;
    //             } else {
    //               uniqueNotificationIds.set(notification._id, true);
    //               return true;
    //             }
    //           }
    //         );
    //         return filteredNotifications;
    //       }
    //       return [savedNotifications];
    //     }
    //   );
    //   return { previousNotifications };
    // },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Notification[]>(
        ["notifications", eventId, "events"],
        context?.previousNotifications
      );
    },
  });
};

export const useDeleteNotifications = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Notification, Error, string[], ContextType>({
    mutationFn: async (data: string[]) => {
      const response = await apiClient(`/notification-types`, "delete", data);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(["notifications", eventId, "events", {}]);
    },
    // onSuccess: (savedNotifications) => {
    //   const previousNotifications = queryClient.getQueryData<Notification[]>([
    //     "notifications",
    //     eventId,
    //     "events",
    //   ]);
    //   queryClient.setQueryData<Notification[] | undefined>(
    //     ["notifications", eventId, "events"],
    //     (notifications) => {
    //       if (notifications) {
    //         return [savedNotifications, ...notifications];
    //       }
    //       return [savedNotifications];
    //     }
    //   );
    //   return { previousNotifications };
    // },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Notification[]>(
        ["notifications", eventId, "events"],

        context?.previousNotifications
      );
    },
  });
};
