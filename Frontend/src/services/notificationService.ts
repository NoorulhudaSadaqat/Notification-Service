import {
  useQuery,
  QueryFunctionContext,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { Notification } from '../types/notification';
import apiClient from './axios';

interface ContextType {
  previousNotifications: Notification[];
}

export const useGetNotifications = (data: object | undefined) =>
  useQuery<Notification[], Error>({
    queryKey: ['notifications', data],
    queryFn: async () => {
      const response = await apiClient('/notification-types', 'get', data);
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });

export const useGetNotification = (notificationId: string | undefined) =>
  useQuery<Notification[], Error>({
    queryKey: ['notifications', notificationId],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const notificationId = queryKey[1];
      const response = await apiClient(
        `/notification-types/${notificationId}`,
        'get'
      );
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

export const useAddNotifications = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Notification, Error, Notification, ContextType>({
    mutationFn: async (notification: Notification) => {
      const response = await apiClient(
        `/notification-types`,
        'post',
        notification
      );
      return response.data;
    },
    onSuccess: (savedNotifications) => {
      const previousNotifications = queryClient.getQueryData<Notification[]>([

        "notifications",
        eventId,
        "events",
      ]);
      queryClient.setQueryData<Notification[] | undefined>(
        ["notifications", eventId, "events"],

        (notifications) => {
          if (notifications) {
            return [savedNotifications, ...notifications];
          }
          return [savedNotifications];
        }
      );
      return { previousNotifications };
    },
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
      const response = await apiClient(

        `/notification-types/${notification._id}`,
        "patch",
        notification
      );
      return response.data;
    },
    onSuccess: (savedNotifications) => {
      const previousNotifications = queryClient.getQueryData<Notification[]>([

        "notifications",
        eventId,
        "events",
      ]);
      queryClient.setQueryData<Notification[] | undefined>(
        ["notifications", eventId, "events"],
        (notifications) => {
          if (notifications) {
            return [savedNotifications, ...notifications];
          }
          return [savedNotifications];
        }
      );
      return { previousNotifications };
    },
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
    onSuccess: (savedNotifications) => {
      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
        eventId,
        "events",
      ]);
      queryClient.setQueryData<Notification[] | undefined>(
        ["notifications", eventId, "events"],

        (notifications) => {
          if (notifications) {
            return [savedNotifications, ...notifications];
          }
          return [savedNotifications];
        }
      );
      return { previousNotifications };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Notification[]>(

        ["notifications", eventId, "events"],

        context?.previousNotifications
      );
    },
  });
};
