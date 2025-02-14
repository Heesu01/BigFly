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
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("sim");
  const newsPerPage = 5;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const start = (page - 1) * newsPerPage + 1;
        const response = await fetch(
          `/v1/search/news.json?query=인천공항&display=${newsPerPage}&start=${start}&sort=${sortOption}`, // ✅ 정렬 방식 반영
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
    /* background-color: #ccc; */
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
  background-color: ${(props) => props.theme.colors.lightBlue};
  border-radius: 20px;
  margin-bottom: 10px;
`;

export default AirportNews;
