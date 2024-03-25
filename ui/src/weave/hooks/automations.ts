import { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { CoreClientContext } from "../contexts/CoreClientContext";
import {
  ListObjectsResponse,
  SyncFluxObjectRequest,
  SyncFluxObjectResponse,
} from "../lib/api/core/core.pb";
import { Kind, ObjectRef } from "../lib/api/core/types.pb";
import { Automation } from "../lib/objects";
import {
  MultiRequestError,
  NoNamespace,
  ReactQueryOptions,
  RequestError,
  SearchedNamespaces,
} from "../lib/types";
import { notifyError, notifySuccess } from "../lib/utils";
import { convertResponse } from "./objects";

type Res = {
  result: Automation[];
  errors: MultiRequestError[];
  searchedNamespaces: SearchedNamespaces;
};

export function useListAutomations(
  namespace: string = NoNamespace,
  opts: ReactQueryOptions<Res, RequestError> = {
    retry: false,
    refetchInterval: 5000,
  }
) {
  const { api } = useContext(CoreClientContext) || {};

  return useQuery<Res, RequestError>(
    ["automations", namespace],
    () => {
      const p = [Kind.HelmRelease, Kind.Kustomization].map((kind) =>
        api
          ?.ListObjects({ namespace, kind })
          .then((response: ListObjectsResponse) => {
            if (!response.objects) response.objects = [];
            if (!response.errors) response.errors = [];
            return { kind, response };
          })
      );
      return Promise.all(p).then((responses) => {
        const final: Res = {
          result: [],
          errors: [],
          searchedNamespaces: {},
        };
        for (const { kind, response } of responses as { kind: Kind; response: ListObjectsResponse }[]) {
          final.result.push(
            ...(response.objects ?? []).map(
              (o: any) => convertResponse(kind, o) as Automation
            )
          );
          final.errors.push(
            ...(response.errors ?? []).map((o: any) => {
            return { ...o, kind };
          }));
          if (response.searchedNamespaces) {
            final.searchedNamespaces[kind] = response.searchedNamespaces;
          }
        }
        return final;
      });
    },
    opts
  );
}

export function useSyncFluxObject(objs: ObjectRef[]) {
  const { api } = useContext(CoreClientContext) || {};
  const mutation = useMutation<
    SyncFluxObjectResponse,
    RequestError,
    SyncFluxObjectRequest
  >(({ withSource }) => {
    if (api) {
      return api.SyncFluxObject({ objects: objs, withSource });
    }
    throw new Error("API is not available.");
  }, {
    onSuccess: () => notifySuccess("Sync request successful!"),
    onError: (error) => notifyError(error.message),
  });

  return mutation;
}
