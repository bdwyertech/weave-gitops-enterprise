import React from "react";
import { useFeatureFlags } from "../../../../hooks/featureflags";
import { useListPolicyValidations } from "../../../../hooks/policyViolations";
import { ListPolicyValidationsRequest } from "../../../../lib/api/core/core.pb";
import { Kind } from "../../../../lib/api/core/types.pb";
import { formatURL } from "../../../../lib/nav";
import { V2Routes } from "../../../../lib/types";
import DataTable, { Field, filterConfig } from "../../../DataTable";
import Link from "../../../Link";
import RequestStateHandler from "../../../RequestStateHandler";
import Text from "../../../Text";
import Timestamp from "../../../Timestamp";
import Severity from "../../Utils/Severity";

interface Props {
  req: ListPolicyValidationsRequest;
}

export const PolicyViolationsList = ({ req }: Props) => {
  const { data, error, isLoading } = useListPolicyValidations(req);
  const { isFlagEnabled } = useFeatureFlags();

  let initialFilterState = {
    ...filterConfig(data?.violations ?? [], "severity"),
    ...filterConfig(data?.violations ?? [], "category"),
  };
  if (isFlagEnabled("WEAVE_GITOPS_FEATURE_CLUSTER")) {
    initialFilterState = {
      ...initialFilterState,
      ...filterConfig(data?.violations ?? [], "clusterName"),
    };
  }
  const fields: Field[] = [
    {
      label: "Message",
      value: ({ message, clusterName, id }) => (
        <Link
          to={formatURL(V2Routes.PolicyViolationDetails, {
            id,
            clusterName,
            name: message,
            kind: req.kind,
          })}
          data-violation-message={message}
        >
          {message}
        </Link>
      ),
      textSearchable: true,
      sortValue: ({ message }) => message,
      maxWidth: 300,
    },
    ...(isFlagEnabled("WEAVE_GITOPS_FEATURE_CLUSTER")
      ? [
          {
            label: "Cluster",
            value: "clusterName",
            sortValue: ({ clusterName }: { clusterName: string }) => clusterName,
          },
        ]
      : []),
    ...(!req.kind || req.kind === Kind.Policy
      ? [
          {
            label: "Application",
            value: ({ namespace, entity }: {
              namespace: string,
              entity: string
            }) => `${namespace}/${entity}`,
            sortValue: ({namespace, entity }: {
              namespace: string,
              entity: string
            }) => `${namespace}/${entity}`,
          },
        ]
      : []),
    {
      label: "Severity",
      value: ({ severity }) => <Severity severity={severity || ""} />,
      sortValue: ({ severity }) => severity,
    },
    {
      label: "Category",
      value: "category",
      sortValue: ({ category }) => category,
    },
    ...(!req.kind || req.kind !== Kind.Policy
      ? [
          {
            label: "Violated Policy",
            value: ({ name, clusterName, policyId }: {
              name: string,
              clusterName: string,
              policyId: string
            }) => (
              <Link
                to={formatURL(V2Routes.PolicyDetailsPage, {
                  clusterName: clusterName,
                  id: policyId,
                  name: name,
                })}
                data-policy-name={name}
              >
                <Text capitalize semiBold>
                  {name}
                </Text>
              </Link>
            ),
            sortValue: ({ name }: { name: string }) => name,
          },
        ]
      : []),
    {
      label: "Violation Time",
      value: ({ createdAt }) => <Timestamp time={createdAt} />,
      defaultSort: true,
      sortValue: ({ createdAt }) => {
        const t = createdAt && new Date(createdAt).getTime();
        return t * -1;
      },
    },
  ];
  return (
    <RequestStateHandler loading={isLoading} error={error}>
      {data?.violations && (
        <DataTable
          filters={initialFilterState}
          rows={data?.violations}
          fields={fields}
        />
      )}
    </RequestStateHandler>
  );
};
