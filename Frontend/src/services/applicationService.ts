import {
  useQuery,
  QueryFunctionContext,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Application, ApplicationResult } from "../types/application";
import apiClient from "./axios";
import { EventResult } from "../types/event";

interface ContextType {
  previousApplications: ApplicationResult;
}

export const useGetApplications = (data: object | undefined) =>
  useQuery<ApplicationResult, Error>({
    queryKey: ["applications", data],
    queryFn: async () => {
      const response = await apiClient("/applications", "get", data);
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true,
  });

export const useGetApplication = (applicationId: number | undefined) =>
  useQuery<Application, Error>({
    queryKey: ["applications", applicationId],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const applicationId = queryKey[1];
      const response = await apiClient(`/applications/${applicationId}`, "get");
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

export const useGetEvents = (
  applicationId: string | undefined,
  data: object | undefined
) =>
  useQuery<EventResult, Error>({
    queryKey: ["events", applicationId, "applications"],
    queryFn: async (context: QueryFunctionContext) => {
      const { queryKey } = context;
      const applicationId = queryKey[1];
      const response = await apiClient(
        `/applications/${applicationId}/events`,
        "get",
        data
      );
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

export const useAddApplication = () => {
  const queryClient = useQueryClient();
  return useMutation<ApplicationResult, Error, Application, ContextType>({
    mutationFn: async (application: Application) => {
      const response = await apiClient(`/applications`, "post", application);
      return response.data;
    },
    // onSuccess: (savedApplication) => {
    //   queryClient.setQueryData<ApplicationResult | undefined>(
    //     ["applications"],
    //     (data: ApplicationResult | undefined) => {
    //       if (data) {
    //         return {
    //           applications: [savedApplication, ...(data.applications || [])],
    //           totalCount: (data.totalCount || 0) + 1,
    //         };
    //       }
    //       return {
    //         applications: [savedApplication],
    //         totalCount: 1,
    //       };
    //     }
    //   );
    // },
    onSettled: () => {
      queryClient.invalidateQueries(["applications", {}]);
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<ApplicationResult | undefined>(
        ["applications"],
        context?.previousApplications
      );
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation<Application, Error, Application, ContextType>({
    mutationFn: async (application: object) => {
      const id = application._id;
      delete application._id;
      const response = await apiClient(
        `/applications/${id}`,
        "patch",
        application
      );
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(["applications", {}]);
    },
    // onSuccess: (savedApplication) => {
    //   const previousApplications = queryClient.getQueryData<Application[]>([
    //     "applications",
    //   ]);
    //   queryClient.setQueryData<Application[] | undefined>(
    //     ["applications"],
    //     (applications) => {
    //       console.log(applications);
    //       if (applications) {
    //         const updatedApplications = [savedApplication, ...applications];
    //         const uniqueApplicationIds = new Map();
    //         const filteredApplications = updatedApplications.filter(
    //           (application) => {
    //             if (uniqueApplicationIds.has(application._id)) {
    //               return false;
    //             } else {
    //               uniqueApplicationIds.set(application._id, true);
    //               return true;
    //             }
    //           }
    //         );
    //         return filteredApplications;
    //       }
    //       return [savedApplication];
    //     }
    //   );
    //   return { previousApplications };
    // },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<ApplicationResult>(
        ["applications", {}],
        context?.previousApplications
      );
    },
  });
};
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation<Application, Error, string[], ContextType>({
    mutationFn: async (data: string[]) => {
      const response = await apiClient(`/applications`, "delete", data);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(["applications", {}]);
    },
    // onSuccess: (savedApplication) => {
    //   const previousApplications = queryClient.getQueryData<Application[]>([
    //     "applications",
    //   ]);
    //   queryClient.setQueryData<Application[] | undefined>(
    //     ["applications"],
    //     (applications) => {
    //       if (applications) {
    //         return [savedApplication, ...applications];
    //       }
    //       return [savedApplication];
    //     }
    //   );
    //   return { previousApplications };
    // },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData<ApplicationResult>(
        ["applications"],
        context?.previousApplications
      );
    },
  });
};
