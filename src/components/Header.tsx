import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Container>
      <Logo onClick={() => navigate("/")}>로고</Logo>
      <Menu>
        <MenuItem to="/realtime" $active={location.pathname === "/realtime"}>
          실시간 공항
          <ActiveLine $active={location.pathname === "/realtime"} />
        </MenuItem>
        <MenuItem to="/departure" $active={location.pathname === "/departure"}>
          추천출발시간
          <ActiveLine $active={location.pathname === "/departure"} />
        </MenuItem>
        <MenuItem to="/news" $active={location.pathname === "/news"}>
          공항뉴스
          <ActiveLine $active={location.pathname === "/news"} />
        </MenuItem>
      </Menu>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray};
`;

const Logo = styled.div`
  cursor: pointer;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 100px;
`;

interface MenuItemProps {
  $active: boolean;
}

const MenuItem = styled(Link)<MenuItemProps>`
  color: ${(props) =>
    props.$active ? props.theme.colors.black : props.theme.colors.gray};
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ActiveLine = styled.div<MenuItemProps>`
  width: 120px;
  height: 3px;
  background-color: ${(props) => props.theme.colors.pointBlue};
  position: absolute;
  bottom: -23px;
  display: ${(props) => (props.$active ? "block" : "none")};
`;

export default Header;
