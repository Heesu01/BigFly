import FlightSearch from "../components/FlightSearch";
import styled from "styled-components";
import flightBg from "../assets/flightBg.png";

const DepartureRecommendation: React.FC = () => {
  const handleSearch = (data: {
    date: Date | null;
    flightNumber: string;
    departureTime: string;
  }) => {
    console.log("검색 데이터:", data);
  };

  return (
    <Container>
      <BackgroundContainer />
      <ContentWrapper>
        <Title>
          여유로운 공항 출발을 위한
          <br /> 최고의 시간은?
          <p>실시간 데이터로 최적의 도착 시간을 추천해드립니다!</p>
        </Title>
        <FlightSearch onSearch={handleSearch} />
      </ContentWrapper>
    </Container>
  );
};

export default DepartureRecommendation;

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url(${flightBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 80%;
  padding-bottom: 100px;
  text-align: center;
`;

const Title = styled.div`
  font-size: 30px;
  line-height: 1.3;
  font-weight: bold;
  p {
    font-size: 15px;
    font-weight: normal;
    margin-bottom: 20px;
    margin-top: 10px;
  }
`;
