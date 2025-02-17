import { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "../api/Axios";
import axios from "axios";

interface WeatherData {
  date: string;
  title: string;
  summary: string;
  outlook: string;
  forecast: string;
  warn: string;
  sel_val1: string;
  sel_val2: string;
  sel_val3: string;
}

const WeatherSection = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await Axios.get<WeatherData>("/get_weather");
        setWeather(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "데이터를 불러오는 중 오류가 발생했습니다."
          );
        } else {
          setError("날씨 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return <Container>로딩 중...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!weather) return <Container>데이터 없음</Container>;

  return (
    <Container>
      <Title>{weather.title}</Title>
      <Summary>{weather.summary}</Summary>
      <Outlook>{weather.outlook}</Outlook>
      <Forecast>{weather.forecast}</Forecast>
      {weather.warn && <Warn>{weather.warn}</Warn>}
    </Container>
  );
};

export default WeatherSection;

const Container = styled.div`
  padding: 10px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.navy};
  margin-bottom: 8px;
  text-align: center;
`;

const Summary = styled.p`
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
`;

const Outlook = styled.p`
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
`;

const Forecast = styled.p`
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
`;

const Warn = styled.p`
  font-size: 16px;
  color: #d32f2f;
  font-weight: bold;
  margin-bottom: 16px;
`;
