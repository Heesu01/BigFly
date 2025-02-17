import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import flightBg from "../assets/flightBg.png";
import { FaChevronDown } from "react-icons/fa";
import TerminalCongestion from "../components/TerminalCongestion";
import Axios from "../api/Axios";
import { MdReplayCircleFilled } from "react-icons/md";

interface PredictionResponse {
  prediction_probabilities: {
    cancellation: number;
    delay: number;
    departure: number;
    return: number;
  };
}

interface TravelTimeResponse {
  departure_time: string;
  predicted_travel_time: number;
}

const DepartureDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state;

  const [prediction, setPrediction] = useState<
    PredictionResponse["prediction_probabilities"] | null
  >(null);
  const [arrivalTime, setArrivalTime] = useState<string>("");
  const [travelTimeStr, setTravelTimeStr] = useState<string>("");

  const contentRef = useRef<HTMLDivElement>(null);

  console.log("searchData:", searchData);

  useEffect(() => {
    if (searchData) {
      Axios.post<PredictionResponse>("/predict_delay", {
        year: searchData.year,
        month: searchData.month,
        day: searchData.day,
        airline: searchData.airline,
        flight_number: searchData.flight_number,
        departure_time: searchData.departure_time,
      })
        .then((res) => {
          setPrediction(res.data.prediction_probabilities);
        })
        .catch((err) => {
          console.error("예측 데이터를 불러오는 중 오류가 발생했습니다.", err);
        });
    }
  }, [searchData]);

  useEffect(() => {
    if (searchData) {
      const flightDate = new Date(
        searchData.year,
        searchData.month - 1,
        searchData.day
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let select_date = "0";
      if (flightDate.getTime() === today.getTime()) {
        select_date = "0";
      } else if (flightDate.getTime() === tomorrow.getTime()) {
        select_date = "1";
      }

      Axios.post<TravelTimeResponse>(
        `${import.meta.env.VITE_NEW_API_URL}/predict/`,
        {
          departure_time: searchData.departure_time,
          select_date,
        }
      )
        .then((res) => {
          const { departure_time, predicted_travel_time } = res.data;
          const [depHour, depMin] = departure_time.split(":").map(Number);
          let totalMinutes = depHour * 60 + depMin;
          const travelMinutes = Math.round(predicted_travel_time / 60);
          const travelMinutesWithBuffer = travelMinutes + 60;
          totalMinutes =
            (((totalMinutes - travelMinutesWithBuffer) % (24 * 60)) + 24 * 60) %
            (24 * 60);
          const arrivalHour = Math.floor(totalMinutes / 60)
            .toString()
            .padStart(2, "0");
          const arrivalMin = (totalMinutes % 60).toString().padStart(2, "0");
          setArrivalTime(`${arrivalHour}:${arrivalMin}`);

          const totalTravelMinutes = travelMinutesWithBuffer;
          const hours = Math.floor(totalTravelMinutes / 60);
          const minutes = totalTravelMinutes % 60;
          const displayTime =
            hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
          setTravelTimeStr(displayTime);
        })
        .catch((err) => {
          console.error("예상 소요시간 데이터를 불러오는 중 오류 발생", err);
        });
    }
  }, [searchData]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 1000);
  }, []);

  if (!searchData) {
    return <Container>검색된 데이터가 없습니다.</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>추천 도착시간</Title>
        <SearchInfo>
          <p>
            {searchData.year}년 {searchData.month}월 {searchData.day}일 |
            항공편: {searchData.airline}
            {searchData.flight_number || "입력 안됨"} | 출국시간:{" "}
            {searchData.departure_time || "입력 안됨"}
          </p>
          <SearchButton onClick={() => navigate("/departure")}>
            <MdReplayCircleFilled size={20} color="#00517d" />
          </SearchButton>
        </SearchInfo>
      </Header>

      <Arrow>
        <FaChevronDown />
        <FaChevronDown />
        <FaChevronDown />
      </Arrow>

      <ContentWrapper ref={contentRef}>
        <InfoSection>
          <TerminalCongestion />
        </InfoSection>

        <InfoSection>
          <Subtitle>가능성 분석</Subtitle>
          {prediction ? (
            <PossibilityContainer>
              <PossibilityBox>
                <PossibilityCircle bgColor="#ffc107">
                  {prediction.cancellation}%
                </PossibilityCircle>
                <PossibilityLabel>결항 가능성</PossibilityLabel>
              </PossibilityBox>
              <PossibilityBox>
                <PossibilityCircle bgColor="#ff4d4d">
                  {prediction.delay}%
                </PossibilityCircle>
                <PossibilityLabel>지연 가능성</PossibilityLabel>
              </PossibilityBox>
              <PossibilityBox>
                <PossibilityCircle bgColor="#3b82f6">
                  {prediction.departure}%
                </PossibilityCircle>
                <PossibilityLabel>출국 가능성</PossibilityLabel>
              </PossibilityBox>
            </PossibilityContainer>
          ) : (
            <span>분석중...</span>
          )}
        </InfoSection>

        <RecommendationBox>
          <Subtitle>안전한 도착시간은!</Subtitle>
          <TimeDisplay>
            {arrivalTime ? `🕘 ${arrivalTime}` : "분석중.."}
          </TimeDisplay>
          <TimeText>
            공항에서의 소요시간은 {travelTimeStr ? travelTimeStr : "분석중.."}
            으로 예측되었습니다.
            <br />
            최소{" "}
            {arrivalTime
              ? `${arrivalTime.split(":")[0]}시 ${arrivalTime.split(":")[1]}분`
              : "분석중..."}
            까지 도착하세요!
          </TimeText>
          <TipBox>
            <p>✈️ 공항은 혼잡할 수 있으니, 여유롭게 도착하세요!</p>
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
  padding-bottom: 50px;
`;

const Header = styled.div`
  width: 100%;
  height: 450px;
  background-image: url(${flightBg});
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin-top: 200px;
  font-size: 28px;
  font-weight: bold;
  color: #222;
`;

const SearchInfo = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`;

const SearchButton = styled.button`
  background: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-bottom: 4px;
`;

const Arrow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
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
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Subtitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const PossibilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;

const PossibilityBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface PossibilityCircleProps {
  bgColor: string;
}

const PossibilityCircle = styled.div<PossibilityCircleProps>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ bgColor }) => bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const PossibilityLabel = styled.p`
  font-size: 14px;
  margin-top: 8px;
  color: #555;
`;

const RecommendationBox = styled.div`
  background-color: #fff;
  padding: 32px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TimeDisplay = styled.p`
  font-size: 36px;
  font-weight: bold;
  color: #ff4d4d;
  margin: 8px 0;
`;

const TimeText = styled.p`
  font-size: 16px;
  color: #444;
  line-height: 1.5;
  margin: 12px 0;
`;

const TipBox = styled.div`
  background: ${(props) => props.theme.colors.blue};
  text-align: center;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  margin-top: 16px;
`;
