import {
  useQuery,
  QueryFunctionContext,
  useMutation,
<<<<<<< Updated upstream
  QueryClient,
} from '@tanstack/react-query';
import { Application } from '../types/application';
import apiClient from './axios';
=======
  useQueryClient,
} from '@tanstack/react-query';
import { Application } from '../types/application';
import apiClient from './axios';

interface ContextType {
  previousApplications: Application[];
}
>>>>>>> Stashed changes

export const useGetApplications = (data: object | undefined) =>
  useQuery<Application[], Error>({
    queryKey: ['applications', data],
    queryFn: async () => {
      const response = await apiClient('/applications', 'get', data);
      return response.data.applications;
    },
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });

export const useGetApplication = (applicationId: number | undefined) =>
  useQuery<Application[], Error>({
    queryKey: ['applications', applicationId],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const applicationId = queryKey[1];
      const response = await apiClient(`/applications/${applicationId}`, 'get');
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

export const useGetEvents = (
  applicationId: string | undefined,
  data: object | undefined
) =>
  useQuery<Event[], Error>({
    queryKey: ['events', applicationId, 'applications', data],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const applicationId = queryKey[1];
      const response = await apiClient(
        `/applications/${applicationId}/events`,
        'get',
        data
      );
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

export const useAddApplication = () => {
<<<<<<< Updated upstream
  const queryClient = new QueryClient();
=======
  const queryClient = useQueryClient();
  return useMutation<Application, Error, Application, ContextType>({
    mutationFn: async (application: Application) => {
      const response = await apiClient(`/applications`, 'post', application);
      return response.data;
    },
    onSuccess: (savedApplication) => {
      const previousApplications = queryClient.getQueryData<Application[]>([
        'applications',
      ]);
      queryClient.setQueryData<Application[] | undefined>(
        ['applications'],
        (applications) => {
          if (applications) {
            return [savedApplication, ...applications];
          }
          return [savedApplication];
        }
      );
      return { previousApplications };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Application[]>(
        ['applications'],
        context?.previousApplications
      );
    },
  });
};

export const useUpateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation<Application, Error, Application, ContextType>({
    mutationFn: async (application: Application) => {
      const response = await apiClient(`/applications`, 'patch', application);
>>>>>>> Stashed changes

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient(`/applications`, 'post');
      return response.data;
    },
    onSuccess: (savedApplication) => {
<<<<<<< Updated upstream
=======
      const previousApplications = queryClient.getQueryData<Application[]>([
        'applications',
      ]);
>>>>>>> Stashed changes
      queryClient.setQueryData<Application[] | undefined>(
        ['applications'],
        (applications) => {
          if (applications) {
            return [savedApplication, ...applications];
          }
          return [savedApplication];
        }
      );
<<<<<<< Updated upstream
=======
      return { previousApplications };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Application[]>(
        ['applications'],
        context?.previousApplications
      );
>>>>>>> Stashed changes
    },
  });
};
