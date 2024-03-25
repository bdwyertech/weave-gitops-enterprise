import * as React from "react";
import { useResolvedPath } from "react-router-dom";
import styled from "styled-components";
import { Crd, Deployment } from "../lib/api/core/types.pb";
import ControllersTable from "./ControllersTable";
import CrdsTable from "./CrdsTable";
import Flex from "./Flex";
import FluxVersionsTable, { FluxVersion } from "./FluxVersionsTable";
import { routeTab } from "./KustomizationDetail";
import SubRouterTabs, { RouterTab } from "./SubRouterTabs";

type Props = {
  className?: string;
  deployments?: Deployment[];
  crds?: Crd[];
};
const fluxVersionLabel = "app.kubernetes.io/version";
const partOfLabel = "app.kubernetes.io/part-of";
const fluxLabel = "flux";

function FluxRuntime({ className, deployments, crds }: Props) {
  const path = useResolvedPath("").pathname;
  const tabs: Array<routeTab> = [
    {
      name: "Controllers",
      path: `controllers`,
      component: () => {
        return <ControllersTable controllers={deployments} />;
      },
      visible: true,
    },
    {
      name: "CRDs",
      path: `crds`,
      component: () => {
        return <CrdsTable crds={crds} />;
      },
      visible: true,
    },
  ];
  const fluxVersions: { [key: string]: FluxVersion } = {};
  if (deployments) {
    deployments
      .filter((d) => d.labels && d.labels[partOfLabel] == fluxLabel)
      .forEach((d) => {
        const fv = d.labels ? d.labels[fluxVersionLabel] : undefined;
        const k = `${fv}${d.clusterName}${d.namespace}`;
        if (!fluxVersions[k]) {
          fluxVersions[k] = {
            version: fv,
            clusterName: d.clusterName,
            namespace: d.namespace,
          };
        }
      });
  }

  tabs.unshift({
    name: "Flux Versions",
    path: `flux`,
    component: () => {
      return <FluxVersionsTable versions={Object.values(fluxVersions)} />;
    },
    visible: true,
  });

  return (
    <Flex wide tall column className={className}>
      <>
        <SubRouterTabs rootPath={tabs[0].path} clearQuery>
          {tabs.map(
            (subRoute, index) =>
              subRoute.visible && (
                <RouterTab
                  name={subRoute.name}
                  path={subRoute.path}
                  key={index}
                >
                  {subRoute.component()}
                </RouterTab>
              )
          )}
        </SubRouterTabs>
      </>
    </Flex>
  );
}

export default styled(FluxRuntime).attrs({ className: FluxRuntime.name })``;
