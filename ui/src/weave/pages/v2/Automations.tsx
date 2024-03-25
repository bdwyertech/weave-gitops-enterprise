import * as React from "react";
import styled from "styled-components";
import AutomationsTable from "../../components/AutomationsTable";
import Page from "../../components/Page";
import { useListAutomations } from "../../hooks/automations";

type Props = {
  className?: string;
};

function Automations({ className }: Props) {
  const { data: automations, error, isLoading } = useListAutomations();

  return (
    <Page
      error={error || automations?.errors}
      loading={isLoading}
      className={className}
      path={[{ label: "Applications" }]}
    >
      <AutomationsTable
        automations={automations?.result}
        searchedNamespaces={automations?.searchedNamespaces}
      />
    </Page>
  );
}

export default styled(Automations).attrs({
  className: Automations.name,
})``;
