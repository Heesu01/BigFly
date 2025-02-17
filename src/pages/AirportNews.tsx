import { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "../api/Axios";

interface NewsArticle {
  title: string;
  originallink: string;
  description: string;
  pubDate: string;
}

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

const NEWS_BASE_URL = import.meta.env.PROD
  ? "https://big-fly.netlify.app/.netlify/functions/NetlifyNews"
  : "v1/search/news.json";

const getCongestionDescription = (level: string): string => {
  switch (level) {
    case "BLUE":
      return "원활";
    case "YELLOW":
      return "보통";
    case "ORANGE":
      return "혼잡";
    case "RED":
      return "매우 혼잡";
    default:
      return "정보 없음";
  }
};

const AirportNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("sim");
  const newsPerPage = 5;
  const [currentCongestion, setCurrentCongestion] =
    useState<ForecastItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const start = (page - 1) * newsPerPage + 1;
        const response = await fetch(
          `${NEWS_BASE_URL}?query=인천공항&display=${newsPerPage}&start=${start}&sort=${sortOption}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Naver-Client-Id": import.meta.env
                .VITE_NAVER_CLIENT_ID as string,
              "X-Naver-Client-Secret": import.meta.env
                .VITE_NAVER_CLIENT_SECRET as string,
            },
          }
        );
        if (!response.ok) {
          throw new Error("네이버 뉴스 API 요청 실패");
        }
        const data = await response.json();
        setNews(data.items);
      } catch (error) {
        console.error("뉴스 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    fetchNews();
  }, [page, sortOption]);

  useEffect(() => {
    const fetchCongestion = async () => {
      try {
        const response = await Axios.get("/passenger_status");
        if (response.data.departure_forecast) {
          const forecasts: ForecastItem[] = response.data.departure_forecast;
          const currentHour = new Date().getHours();
          const index = forecasts.findIndex((item) => {
            const [start, end] = item.time_range.split("_").map(Number);
            return currentHour >= start && currentHour < end;
          });
          if (index >= 0) {
            setCurrentCongestion(forecasts[index]);
          }
        }
      } catch (error) {
        console.error("공항 혼잡도 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    fetchCongestion();
  }, []);

  return (
    <Container>
      <NewsWrapper>
        <Header>
          <Title>공항 뉴스</Title>
          <SortSelect
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date">최신순</option>
            <option value="sim">정확도순</option>
          </SortSelect>
        </Header>
        <hr />
        {news.length > 0 ? (
          news.map((article, index) => (
            <NewsItem key={index}>
              <NewsContent>
                <NewsTitle
                  dangerouslySetInnerHTML={{ __html: article.title }}
                />
                <NewsDescription
                  dangerouslySetInnerHTML={{ __html: article.description }}
                />
                <NewsMeta>
                  <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                  <NewsLink
                    href={article.originallink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    기사 원문 보기 &gt;
                  </NewsLink>
                </NewsMeta>
              </NewsContent>
            </NewsItem>
          ))
        ) : (
          <p>뉴스를 불러오는 중...</p>
        )}
        <Pagination>
          <PageButton disabled={page === 1} onClick={() => setPage(page - 1)}>
            &lt;
          </PageButton>
          <PageNumber>{page}</PageNumber>
          <PageButton onClick={() => setPage(page + 1)}>&gt;</PageButton>
        </Pagination>
      </NewsWrapper>
      <Sidebar>
        <MoreLink href="/realtime">
          <p>실시간 공항 혼잡도</p>
          <span>더보기 &gt;</span>
        </MoreLink>
        <CongestionCard>
          {currentCongestion ? (
            <>
              <OverallStatus>
                현재 상태:{" "}
                {getCongestionDescription(currentCongestion.congestion_level)}
              </OverallStatus>
              <OverallTotal>
                총 출국자: {currentCongestion.total_departure.toLocaleString()}
                명
              </OverallTotal>
              <TerminalSection>
                <TerminalTitle>터미널 1</TerminalTitle>
                <GateDetail>
                  출국장 1-2: {currentCongestion.T1_departure_1_2}명
                </GateDetail>
                <GateDetail>
                  출국장 3: {currentCongestion.T1_departure_3}명
                </GateDetail>
                <GateDetail>
                  출국장 4: {currentCongestion.T1_departure_4}명
                </GateDetail>
                <GateDetail>
                  출국장 5-6: {currentCongestion.T1_departure_5_6}명
                </GateDetail>
                <TerminalTotal>
                  T1 합계: {currentCongestion.T1_total.toLocaleString()}명
                </TerminalTotal>
              </TerminalSection>
              <TerminalSection>
                <TerminalTitle>터미널 2</TerminalTitle>
                <GateDetail>
                  출국장 1: {currentCongestion.T2_departure_1}명
                </GateDetail>
                <GateDetail>
                  출국장 2: {currentCongestion.T2_departure_2}명
                </GateDetail>
                <TerminalTotal>
                  T2 합계: {currentCongestion.T2_total.toLocaleString()}명
                </TerminalTotal>
              </TerminalSection>
            </>
          ) : (
            <div>정보를 불러오는 중...</div>
          )}
        </CongestionCard>
      </Sidebar>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;
  margin: 50px auto;
  background-color: #fff;
  border: 1px solid #ddd;
`;

const NewsWrapper = styled.div`
  width: 80%;
  padding: 30px;
  border-radius: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
`;

const SortSelect = styled.select`
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const NewsItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px 10px;
  border-bottom: 1px solid #ddd;
`;

const NewsContent = styled.div`
  flex: 1;
`;

const NewsTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const NewsDescription = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.5;
`;

const NewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #888;
  margin-top: 5px;
`;

const NewsLink = styled.a`
  font-size: 13px;
  color: ${(props) => props.theme.colors.navy};
  text-decoration: underline;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  border: none;
  background-color: #fff;
  padding: 4px 10px;
  margin: 0 10px;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    color: #fff;
  }
`;

const PageNumber = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const Sidebar = styled.div`
  width: 20%;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const CongestionCard = styled.div`
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  background-color: ${(props) => props.theme.colors.lightBlue};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OverallStatus = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const OverallTotal = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
  color: #555;
`;

const TerminalSection = styled.div`
  text-align: left;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
`;

const TerminalTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #444;
  border-bottom: 1px solid #eee;
`;

const GateDetail = styled.p`
  font-size: 14px;
  margin: 3px 0;
  color: #666;
`;

const TerminalTotal = styled.p`
  font-size: 15px;
  font-weight: 600;
  margin-top: 8px;
  color: #333;
`;

const MoreLink = styled.a`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;
  margin: 5px;
  margin-top: 20px;
  p {
    font-weight: bold;
    font-size: 16px;
  }
  span {
    font-size: 12px;
    margin-top: 5px;
  }
`;

export default AirportNews;
