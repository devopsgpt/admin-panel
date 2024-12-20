import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useMutation } from '@tanstack/react-query';
import { engineInstance, externalTemplateInstance } from '@/lib/axios';

async function request<R, B, E = unknown>(
  axiosInstance: AxiosInstance,
  method: 'get' | 'post' | 'put' | 'patch',
  url: string,
  body?: B,
  headers?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<R>> {
  try {
    return await axiosInstance({
      method,
      url,
      ...(method !== 'get' && { data: body }),
      headers,
      ...config,
    });
  } catch (error) {
    throw error as AxiosError<E>;
  }
}

function mutationHook(method: 'get' | 'post' | 'put' | 'patch') {
  return function useCustomMutation<R, B, E = unknown>(
    url: string,
    key: string,
    isEngine: boolean,
    headers?: any,
    configs?: AxiosRequestConfig,
  ) {
    return useMutation<AxiosResponse<R>, AxiosError<E>, B>({
      mutationKey: [key],
      mutationFn: (body: B) =>
        isEngine
          ? request<R, B, E>(
              engineInstance,
              method,
              url,
              body,
              headers,
              configs,
            )
          : request<R, B, E>(
              externalTemplateInstance,
              method,
              url,
              body,
              headers,
              configs,
            ),
    });
  };
}

// Export hooks for each HTTP method.
export const useGet = mutationHook('get');
export const usePost = mutationHook('post');
export const usePut = mutationHook('put');
export const usePatch = mutationHook('patch');
