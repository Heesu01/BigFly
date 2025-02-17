import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Axios from "../api/Axios";
import axios from "axios";
import { MdInfoOutline } from "react-icons/md";

interface ForecastItem {
  time_range: string;
  T1_departure_1_2: number;
  T1_departure_3: number;
  T1_departure_4: number;
  T1_departure_5_6: number;
  T1_total: number;
  T2_departure_1: number;
  T2_departure_2: number;
  T2_total: number;
  total_departure: number;
  congestion_level: string;
}

const DepartureStatus = () => {
  const [departureData, setDepartureData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const itemsPerPage = 3;
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("/passenger_status");
        if (response.data.departure_forecast) {
          const forecasts = response.data.departure_forecast;
          setDepartureData(forecasts);

          const currentHour = new Date().getHours();
          const index = forecasts.findIndex((item: ForecastItem) => {
            const [start, end] = item.time_range.split("_").map(Number);
            return currentHour >= start && currentHour < end;
          });
          if (index >= 0) {
            setPage(Math.floor(index / itemsPerPage) + 1);
          }
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "데이터를 불러오는 중 오류가 발생했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(departureData.length / itemsPerPage);
  const displayedItems = departureData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <Container>⏳ 데이터 불러오는 중...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Title>출국장 혼잡도 예측</Title>
      <InfoButton onClick={() => setShowLegend((prev) => !prev)}>
        <MdInfoOutline />
      </InfoButton>
      {showLegend && (
        <LegendPopover ref={popoverRef}>
          <LegendTitle>혼잡도 색상 기준</LegendTitle>
          <LegendItem color="#b3e5fc">
            <LegendLabel>BLUE</LegendLabel>
            <LegendText>시간당 7,600명 이하</LegendText>
          </LegendItem>
          <LegendItem color="#fff3cd">
            <LegendLabel>YELLOW</LegendLabel>
            <LegendText>시간당 7,600 ~ 8,200명</LegendText>
          </LegendItem>
          <LegendItem color="#ffcc80">
            <LegendLabel>ORANGE</LegendLabel>
            <LegendText>시간당 8,200 ~ 8,600명</LegendText>
          </LegendItem>
          <LegendItem color="#ffcccc">
            <LegendLabel>RED</LegendLabel>
            <LegendText>시간당 8,600명 이상</LegendText>
          </LegendItem>
        </LegendPopover>
      )}

      {displayedItems.length === 0 ? (
        <NoData>현재 출국장 혼잡도 데이터가 없습니다.</NoData>
      ) : (
        <StatGridWrapper>
          {page > 1 && (
            <LeftArrow onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
              &lt;
            </LeftArrow>
          )}
          <StatGrid>
            {displayedItems.map((item, index) => (
              <StatItem key={index} congestionLevel={item.congestion_level}>
                <TimeRange>{item.time_range.replace("_", " ~ ")}시</TimeRange>
                <Detail>
                  <Label>총 출국자</Label>
                  <Value>{item.total_departure.toLocaleString()}명</Value>
                </Detail>
                <SubSection>
                  <SectionTitle>터미널 1</SectionTitle>
                  <GateDetail>출국장 1-2: {item.T1_departure_1_2}명</GateDetail>
                  <GateDetail>출국장 3: {item.T1_departure_3}명</GateDetail>
                  <GateDetail>출국장 4: {item.T1_departure_4}명</GateDetail>
                  <GateDetail>출국장 5-6: {item.T1_departure_5_6}명</GateDetail>
                  <Total>T1 합계: {item.T1_total.toLocaleString()}명</Total>
                </SubSection>
                <SubSection>
                  <SectionTitle>터미널 2</SectionTitle>
                  <GateDetail>출국장 1: {item.T2_departure_1}명</GateDetail>
                  <GateDetail>출국장 2: {item.T2_departure_2}명</GateDetail>
                  <Total>T2 합계: {item.T2_total.toLocaleString()}명</Total>
                </SubSection>
              </StatItem>
            ))}
          </StatGrid>
          {page < totalPages && (
            <RightArrow
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              &gt;
            </RightArrow>
          )}
        </StatGridWrapper>
      )}
    </Container>
  );
};

export default DepartureStatus;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 30px 50px;
  margin: 20px auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h3`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
`;

const InfoButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 28px;
  cursor: pointer;
  color: #1976d2;
  &:hover {
    color: #1565c0;
  }
`;

const LegendPopover = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  width: 300px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 10;
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LegendTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #444;
  margin-bottom: 10px;
  text-align: center;
`;

const LegendItem = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LegendLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #333;
`;

const LegendText = styled.span`
  font-size: 14px;
  text-align: center;
  color: #555;
`;

const NoData = styled.p`
  font-size: 16px;
  color: #888;
  margin: 40px 0;
`;

const StatGridWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
`;

const StatItem = styled.div<{ congestionLevel: string }>`
  background: ${(props) =>
    props.congestionLevel === "RED"
      ? "#ffebeb"
      : props.congestionLevel === "ORANGE"
      ? "#fff4e6"
      : props.congestionLevel === "YELLOW"
      ? "#fffbea"
      : "#e1f5fe"};
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TimeRange = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #222;
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
`;

const Label = styled.span`
  font-weight: 600;
  color: #555;
`;

const Value = styled.span`
  font-weight: 700;
  color: #222;
`;

const SubSection = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 12px;
  margin-top: 10px;
`;

const SectionTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #444;
  margin-bottom: 6px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
`;

const GateDetail = styled.p`
  font-size: 15px;
  margin: 4px 0;
  color: #555;
`;

const Total = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin-top: 8px;
`;

const LeftArrow = styled.button`
  position: absolute;
  top: 50%;
  left: -35px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 30px;
  color: #1976d2;
  cursor: pointer;
  &:hover {
    color: #1565c0;
  }
`;

const RightArrow = styled.button`
  position: absolute;
  top: 50%;
  right: -35px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 30px;
  color: #1976d2;
  cursor: pointer;
  &:hover {
    color: #1565c0;
  }
`;
