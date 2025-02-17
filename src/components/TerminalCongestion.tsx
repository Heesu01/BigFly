import { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "../api/Axios";

interface ForecastItem {
  time_range: string;
  total_departure: number;
  T1_departure_1_2: number;
  T1_departure_3: number;
  T1_departure_4: number;
  T1_departure_5_6: number;
  T1_total: number;
  T2_departure_1: number;
  T2_departure_2: number;
  T2_total: number;
  congestion_level: string;
}

const getGateCongestionLevel = (value: number) => {
  if (value >= 1000) {
    return { description: "매우 혼잡", color: "#d32f2f" };
  } else if (value >= 600) {
    return { description: "혼잡", color: "#ff8a65" };
  } else if (value >= 300) {
    return { description: "보통", color: "#fbc02d" };
  } else {
    return { description: "원활", color: "#0288d1" };
  }
};

const TerminalCongestion = () => {
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [currentForecast, setCurrentForecast] = useState<ForecastItem | null>(
    null
  );

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await Axios.get("/passenger_status");
        if (response.data.departure_forecast) {
          const data = response.data.departure_forecast as ForecastItem[];
          setForecastData(data);
        }
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };
    fetchForecast();
  }, []);

  useEffect(() => {
    if (forecastData.length > 0) {
      const currentHour = new Date().getHours();
      const current = forecastData.find((item) => {
        const [start, end] = item.time_range.split("_").map(Number);
        return currentHour >= start && currentHour < end;
      });
      setCurrentForecast(current || null);
    }
  }, [forecastData]);

  return (
    <Container>
      <Subtitle>현재 출국장 혼잡도</Subtitle>
      {currentForecast ? (
        <ForecastDetail>
          <TerminalContainer>
            <TerminalCard>
              <TerminalHeader>터미널 1</TerminalHeader>
              <GateRow>
                <GateLabel>
                  <Dot
                    color={
                      getGateCongestionLevel(currentForecast.T1_departure_1_2)
                        .color
                    }
                  />
                  출국장 1-2:
                </GateLabel>
                <GateValue>
                  {currentForecast.T1_departure_1_2}명{" "}
                  <GateStatus
                    color={
                      getGateCongestionLevel(currentForecast.T1_departure_1_2)
                        .color
                    }
                  >
                    {
                      getGateCongestionLevel(currentForecast.T1_departure_1_2)
                        .description
                    }
                  </GateStatus>
                </GateValue>
              </GateRow>
              <GateRow>
                <GateLabel>
                  <Dot
                    color={
                      getGateCongestionLevel(currentForecast.T1_departure_3)
                        .color
                    }
                  />
                  출국장 3:
                </GateLabel>
                <GateValue>
                  {currentForecast.T1_departure_3}명{" "}
                  <GateStatus
                    color={
                      getGateCongestionLevel(currentForecast.T1_departure_3)
                        .color
                    }
                  >
                    {
                      getGateCongestionLevel(currentForecast.T1_departure_3)
                        .description
                    }
                  </GateStatus>
                </GateValue>
              </GateRow>
              <GateRow>
                <GateLabel>
                  <Dot
                    color={
                      getGateCongestionLevel(currentForecast.T1_departure_4)
                        .color
                    }
                  />
                  출국장 4:
                </GateLabel>
                <GateValue>
                  {currentForecast.T1_departure_4}명{" "}
                  <GateStatus
                    color={
                      getGateCongestionLevel(currentForecast.T1_departure_4)
                        .color
                    }
                  >
                    {
                      getGateCongestionLevel(currentForecast.T1_departure_4)
                        .description
                    }
                  </GateStatus>
                </GateValue>
              </GateRow>
              <GateRow>
                <GateLabel>
                  <Dot
                    color={
                      getGateCongestionLevel(currentForecast.T1_departure_5_6)
                        .color
                    }
                  />
                  출국장 5-6:
                </GateLabel>
                <GateValue>
                  {currentForecast.T1_departure_5_6}명{" "}
                  <GateStatus
                    color={
                      getGateCongestionLevel(currentForecast.T1_departure_5_6)
                        .color
                    }
                  >
                    {
                      getGateCongestionLevel(currentForecast.T1_departure_5_6)
                        .description
                    }
                  </GateStatus>
                </GateValue>
              </GateRow>
              <TerminalSummary>
                T1 합계: {currentForecast.T1_total.toLocaleString()}명
              </TerminalSummary>
            </TerminalCard>
            <TerminalCard>
              <TerminalHeader>터미널 2</TerminalHeader>
              <GateRow>
                <GateLabel>
                  <Dot
                    color={
                      getGateCongestionLevel(currentForecast.T2_departure_1)
                        .color
                    }
                  />
                  출국장 1:
                </GateLabel>
                <GateValue>
                  {currentForecast.T2_departure_1}명{" "}
                  <GateStatus
                    color={
                      getGateCongestionLevel(currentForecast.T2_departure_1)
                        .color
                    }
                  >
                    {
                      getGateCongestionLevel(currentForecast.T2_departure_1)
                        .description
                    }
                  </GateStatus>
                </GateValue>
              </GateRow>
              <GateRow>
                <GateLabel>
                  <Dot
                    color={
                      getGateCongestionLevel(currentForecast.T2_departure_2)
                        .color
                    }
                  />
                  출국장 2:
                </GateLabel>
                <GateValue>
                  {currentForecast.T2_departure_2}명{" "}
                  <GateStatus
                    color={
                      getGateCongestionLevel(currentForecast.T2_departure_2)
                        .color
                    }
                  >
                    {
                      getGateCongestionLevel(currentForecast.T2_departure_2)
                        .description
                    }
                  </GateStatus>
                </GateValue>
              </GateRow>
              <TerminalSummary>
                T2 합계: {currentForecast.T2_total.toLocaleString()}명
              </TerminalSummary>
            </TerminalCard>
          </TerminalContainer>
        </ForecastDetail>
      ) : (
        <PlaceholderText>데이터 없음</PlaceholderText>
      )}
    </Container>
  );
};

export default TerminalCongestion;

const Container = styled.div`
  text-align: center;
`;

const Subtitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 45px;
`;

const ForecastDetail = styled.div`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
`;

const TerminalContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const TerminalCard = styled.div`
  flex: 1;
  min-width: 200px;
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const TerminalHeader = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
`;

const GateRow = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 2px;
  justify-content: space-between;
`;

const GateLabel = styled.span`
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
`;

const GateValue = styled.span`
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
`;

const GateStatus = styled.span<{ color: string }>`
  font-size: 10px;
  font-weight: bold;
  color: ${({ color }) => color};
  margin-left: 8px;
`;

const Dot = styled.span<{ color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-right: 6px;
`;

const TerminalSummary = styled.p`
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-top: 8px;
  border-top: 1px dashed #ccc;
  padding-top: 4px;
  text-align: right;
`;

const PlaceholderText = styled.p`
  color: #868e96;
`;
