import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

const RealTimeAirport = () => {
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [currentForecast, setCurrentForecast] = useState<ForecastItem | null>(
    null
  );

  const today = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}년 ${month}월 ${day}일`;
  })();

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await Axios.get("/passenger_status");
        if (response.data.departure_forecast) {
          const data = (response.data.departure_forecast as ForecastItem[]).map(
            (item: ForecastItem) => ({
              time_range: item.time_range,
              total_departure: item.total_departure,
              T1_departure_1_2: item.T1_departure_1_2,
              T1_departure_3: item.T1_departure_3,
              T1_departure_4: item.T1_departure_4,
              T1_departure_5_6: item.T1_departure_5_6,
              T1_total: item.T1_total,
              T2_departure_1: item.T2_departure_1,
              T2_departure_2: item.T2_departure_2,
              T2_total: item.T2_total,
              congestion_level: item.congestion_level,
            })
          );
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
      <Content>
        <Title>실시간 공항정보</Title>
        <Grid>
          <Box>
            <Subtitle>{today} 시간대별 출국자 예측</Subtitle>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={forecastData}>
                <XAxis
                  dataKey="time_range"
                  tickFormatter={(value: string) => value.split("_")[0]}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total_departure"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <Subtitle>지연 가능성</Subtitle>
            <PlaceholderText>데이터 없음</PlaceholderText>
          </Box>
          <Box>
            <Subtitle>출국장별</Subtitle>
            {currentForecast ? (
              <ForecastDetail>
                <TerminalContainer>
                  <TerminalCard>
                    <TerminalHeader>터미널 1</TerminalHeader>
                    <GateRow>
                      <GateLabel>
                        <Dot
                          color={
                            getGateCongestionLevel(
                              currentForecast.T1_departure_1_2
                            ).color
                          }
                        />
                        출국장 1-2:
                      </GateLabel>
                      <GateValue>
                        {currentForecast.T1_departure_1_2}명{" "}
                        <GateStatus
                          color={
                            getGateCongestionLevel(
                              currentForecast.T1_departure_1_2
                            ).color
                          }
                        >
                          {
                            getGateCongestionLevel(
                              currentForecast.T1_departure_1_2
                            ).description
                          }
                        </GateStatus>
                      </GateValue>
                    </GateRow>
                    <GateRow>
                      <GateLabel>
                        <Dot
                          color={
                            getGateCongestionLevel(
                              currentForecast.T1_departure_3
                            ).color
                          }
                        />
                        출국장 3:
                      </GateLabel>
                      <GateValue>
                        {currentForecast.T1_departure_3}명{" "}
                        <GateStatus
                          color={
                            getGateCongestionLevel(
                              currentForecast.T1_departure_3
                            ).color
                          }
                        >
                          {
                            getGateCongestionLevel(
                              currentForecast.T1_departure_3
                            ).description
                          }
                        </GateStatus>
                      </GateValue>
                    </GateRow>
                    <GateRow>
                      <GateLabel>
                        <Dot
                          color={
                            getGateCongestionLevel(
                              currentForecast.T1_departure_4
                            ).color
                          }
                        />
                        출국장 4:
                      </GateLabel>
                      <GateValue>
                        {currentForecast.T1_departure_4}명{" "}
                        <GateStatus
                          color={
                            getGateCongestionLevel(
                              currentForecast.T1_departure_4
                            ).color
                          }
                        >
                          {
                            getGateCongestionLevel(
                              currentForecast.T1_departure_4
                            ).description
                          }
                        </GateStatus>
                      </GateValue>
                    </GateRow>
                    <GateRow>
                      <GateLabel>
                        <Dot
                          color={
                            getGateCongestionLevel(
                              currentForecast.T1_departure_5_6
                            ).color
                          }
                        />
                        출국장 5-6:
                      </GateLabel>
                      <GateValue>
                        {currentForecast.T1_departure_5_6}명{" "}
                        <GateStatus
                          color={
                            getGateCongestionLevel(
                              currentForecast.T1_departure_5_6
                            ).color
                          }
                        >
                          {
                            getGateCongestionLevel(
                              currentForecast.T1_departure_5_6
                            ).description
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
                            getGateCongestionLevel(
                              currentForecast.T2_departure_1
                            ).color
                          }
                        />
                        출국장 1:
                      </GateLabel>
                      <GateValue>
                        {currentForecast.T2_departure_1}명{" "}
                        <GateStatus
                          color={
                            getGateCongestionLevel(
                              currentForecast.T2_departure_1
                            ).color
                          }
                        >
                          {
                            getGateCongestionLevel(
                              currentForecast.T2_departure_1
                            ).description
                          }
                        </GateStatus>
                      </GateValue>
                    </GateRow>
                    <GateRow>
                      <GateLabel>
                        <Dot
                          color={
                            getGateCongestionLevel(
                              currentForecast.T2_departure_2
                            ).color
                          }
                        />
                        출국장 2:
                      </GateLabel>
                      <GateValue>
                        {currentForecast.T2_departure_2}명{" "}
                        <GateStatus
                          color={
                            getGateCongestionLevel(
                              currentForecast.T2_departure_2
                            ).color
                          }
                        >
                          {
                            getGateCongestionLevel(
                              currentForecast.T2_departure_2
                            ).description
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
          </Box>
          <Box>
            <Subtitle>항공사별</Subtitle>
            <PlaceholderText>데이터 없음</PlaceholderText>
          </Box>
          <FullWidthBox>
            <Subtitle>주차장 정보</Subtitle>
          </FullWidthBox>
        </Grid>
      </Content>
    </Container>
  );
};

export default RealTimeAirport;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  color: #343a40;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Box = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
`;

const PlaceholderText = styled.p`
  color: #868e96;
`;

const FullWidthBox = styled(Box)`
  grid-column: span 2;
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
`;

const TerminalCard = styled.div`
  flex: 1;
  min-width: 200px;
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const TerminalHeader = styled.h3`
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
  margin: 4px 0;
`;

const GateLabel = styled.span`
  font-size: 14px;
  color: #555;
  width: 120px;
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
  font-size: 12px;
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
