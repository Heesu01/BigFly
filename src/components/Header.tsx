import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Container>
      <Logo onClick={() => navigate("/")}>BigFly</Logo>
      <Menu>
        <MenuItem to="/realtime" $active={location.pathname === "/realtime"}>
          실시간 공항
          <ActiveLine $active={location.pathname === "/realtime"} />
        </MenuItem>
        <MenuItem to="/departure" $active={location.pathname === "/departure"}>
          추천출발시간
          <ActiveLine $active={location.pathname.startsWith("/departure")} />
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
  /* background-color: rgba(255, 255, 255, 0.1); */
`;

const Logo = styled.div`
  cursor: pointer;
  ${(props) => props.theme.fonts.logo};
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
    props.$active ? props.theme.colors.pointBlue : props.theme.colors.gray};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  text-decoration: none;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: color 0.3s ease-in-out;
`;

const ActiveLine = styled.div<MenuItemProps>`
  width: 120px;
  height: 3px;
  background-color: ${(props) => props.theme.colors.pointBlue};
  position: absolute;
  bottom: -23px;
  display: ${(props) => (props.$active ? "block" : "none")};
  transition: opacity 0.3s ease-in-out;
`;

export default Header;
