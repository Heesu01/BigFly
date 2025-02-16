import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import flightBg from "../assets/flightBg.png";
import { FaChevronDown } from "react-icons/fa";

const DepartureDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state;

  if (!searchData) {
    return <Container>❌ 검색된 데이터가 없습니다.</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>추천 도착시간</Title>
        <SearchInfo>
          <p>
            {searchData.date
              ? searchData.date.toLocaleDateString()
              : "날짜 선택 안됨"}{" "}
            | 항공편: {searchData.flightNumber || "입력 안됨"} | 출국시간:{" "}
            {searchData.departureTime || "입력 안됨"}
          </p>
          <SearchButton onClick={() => navigate("/departure")}>
            🔄 다시 검색하기
          </SearchButton>
        </SearchInfo>
      </Header>

      <Arrow>
        <FaChevronDown />
        <FaChevronDown />
        <FaChevronDown />
      </Arrow>

      <ContentWrapper>
        <InfoSection>
          <Subtitle>현재 공항 혼잡도</Subtitle>
          <GraphPlaceholder>📊 혼잡도 그래프</GraphPlaceholder>
        </InfoSection>

        <InfoSection>
          <Subtitle>지연가능성</Subtitle>
          <GateBox>
            <GateCircle>29%</GateCircle>
            <GateText>TEE22의 29% 지연 가능성</GateText>
          </GateBox>
        </InfoSection>

        <InfoSection>
          <Subtitle>결항 회항 가능성</Subtitle>
          <GraphPlaceholder>가능성</GraphPlaceholder>
        </InfoSection>

        <RecommendationBox>
          <Subtitle>안전한 출발시간은!</Subtitle>
          <TimeDisplay>🕘 09:00</TimeDisplay>
          <TimeText>
            최소 {searchData.departureTime || "출국시간"}까지 도착하세요!
          </TimeText>
          <TipBox>
            <p>✈️ 공항은 혼잡할 수 있습니다. 여유롭게 도착하세요!</p>
          </TipBox>
        </RecommendationBox>
      </ContentWrapper>
    </Container>
  );
};

export default DepartureDetail;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  height: 450px;
  background: url("/assets/flightBg.png");
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${flightBg});
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #222;
`;

const SearchInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const SearchButton = styled.button`
  background: #007bff;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #0056b3;
  }
`;

const Arrow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 0;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 90%;
  max-width: 1200px;
`;

const InfoSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Subtitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const GraphPlaceholder = styled.div`
  background: #e9ecef;
  height: 100px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-weight: bold;
`;

/* 🏁 게이트 정보 */
const GateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GateCircle = styled.div`
  width: 60px;
  height: 60px;
  background: #007bff;
  color: white;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
`;

const GateText = styled.p`
  font-size: 14px;
  margin-top: 10px;
  color: #555;
`;

const RecommendationBox = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  grid-column: span 3;
`;

const TimeDisplay = styled.p`
  font-size: 34px;
  font-weight: bold;
  color: #ff4d4d;
`;

const TimeText = styled.p`
  font-size: 15px;
  color: #444;
  margin-top: 5px;
`;

const TipBox = styled.div`
  background: #f1f3f5;
  padding: 12px;
  margin-top: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;
