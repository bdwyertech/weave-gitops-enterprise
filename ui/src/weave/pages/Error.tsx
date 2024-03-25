import * as React from "react";
import styled from "styled-components";
import Flex from "../components/Flex";
import Content from "../components/Page";

type Props = {
  className?: string;
  code?: string;
};

function ErrorPage({ className }: Props) {
  const Error404Animation = React.lazy(
    () => import("../components/Animations/Error404")
  );

  return (
    <Content className={className} path={[]}>
      <Flex center wide align>
        <React.Suspense fallback={null}>
          <Error404Animation />
        </React.Suspense>
      </Flex>
    </Content>
  );
}

export default styled(ErrorPage)``;
