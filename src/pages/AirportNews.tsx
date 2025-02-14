import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface NewsArticle {
  title: string;
  originallink: string;
  description: string;
  pubDate: string;
}

const AirportNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNews([
          {
            title: "인천공항 ‘비상’, 폭설 때보다 혼잡...",
            originallink: "#",
            description:
              "설 명절 연휴를 하루 앞둔 24일, 인천공항은 예년보다 더욱 혼잡한 모습을 보였다.",
            pubDate: "2024-02-13",
          },
          {
            title: "인천공항, 4시간 전에는 와야...",
            originallink: "#",
            description:
              "출국장 이용객이 오전 7~8시에 6038명으로 예상되며, 혼잡이 심할 것으로 보인다.",
            pubDate: "2024-02-13",
          },
        ]);
      } catch (error) {
        console.error("뉴스 데이터를 불러오는 중 오류 발생", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <Container>
      <NewsWrapper>
        <Title>공항 뉴스</Title>
        <hr />
        {news.map((article, index) => (
          <NewsItem key={index}>
            <NewsContent>
              <NewsTitle dangerouslySetInnerHTML={{ __html: article.title }} />
              <NewsDescription
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
              <NewsMeta>
                <span>{article.pubDate}</span>
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
        ))}
      </NewsWrapper>
      <Sidebar>
        <MoreLink>
          <p>실시간 공항 정보</p>
          <span>더보기 &gt;</span>
        </MoreLink>
        <ChartPlaceholder />

        <MoreLink>
          <p>실시간 공항 정보</p>
          <span>더보기 &gt;</span>
        </MoreLink>
        <ChartPlaceholder />
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

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const NewsItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px 0;
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
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;

const Sidebar = styled.div`
  width: 20%;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const MoreLink = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;
  margin: 5px 10px;
  p {
    font-weight: bold;
  }
  span {
    font-size: 12px;
    margin-top: 5px;
  }
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${(props) => props.theme.colors.lightBlue || "#e0e0e0"};
  border-radius: 20px;
  margin-bottom: 10px;
`;

export default AirportNews;
