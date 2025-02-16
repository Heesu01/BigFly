import { ReactNode } from "react";
import Header from "../components/Header";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutContainer>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <Main>{children}</Main>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderWrapper = styled.div`
  height: 60px;
`;

const Main = styled.main`
  flex: 1;
`;

export default Layout;
