import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlightSearch from "../components/FlightSearch";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header />

      <Body>
        <h1>
          해외여행의 모든 것
          <br />
          빅파이와 함께
        </h1>
        <FlightSearch />

        <NowBox>
          <div>
            <p>지금 인천공항은?</p>
            <p onClick={() => navigate("/realtime")}>더보기 &gt;</p>
          </div>
          <NowContent></NowContent>
        </NowBox>

        <MenuBox>
          <Item onClick={() => navigate("/realtime")}>
            <Title>실시간 공항정보</Title>
            <p>지금 공항을 더 자세히 알고 싶어요🙋 (혼잡, 지연, 결항 등)</p>
            <Img>✈️</Img>
          </Item>
          <Item onClick={() => navigate("/departure")}>
            <Title>추천 도착시간</Title>
            <p>내가 몇시에 도착해야 할지알고 싶다면? </p>
            <Img>🛫</Img>
          </Item>
          <Item onClick={() => navigate("/news")}>
            <Title>공항 뉴스</Title>
            <p>공항과 관련된 뉴스가 궁금해요!</p>
            <Img>📰</Img>
          </Item>
        </MenuBox>
      </Body>
      {/* <Footer /> */}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  background: linear-gradient(to bottom, #ffffff, #b5e6ff);
  padding-bottom: 100px;
`;

const Body = styled.div`
  width: 80%;
  margin: auto;

  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 30px;
    margin-top: 60px;
    line-height: 1.5;
  }
`;

const NowBox = styled.div`
  margin-top: 50px;
  div {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding: 0 10px;
    p {
      cursor: pointer;
    }
  }
`;

const NowContent = styled.div`
  height: 350px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
`;

const MenuBox = styled.div`
  margin-top: 50px;
  height: 300px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
`;

const Item = styled.div`
  width: 300px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 30px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  p {
    word-break: keep-all;
    overflow-wrap: break-word;
    text-align: center;
    margin-top: 10px;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
`;

const Img = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 50%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
`;

export default MainPage;
