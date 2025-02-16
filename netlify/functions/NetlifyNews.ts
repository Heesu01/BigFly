import axios from "axios";
import { HandlerEvent } from "@netlify/functions";

export const handler = async (event: HandlerEvent) => {
  console.log("Netlify 함수 실행됨");
  console.log("event.queryStringParameters:", event.queryStringParameters);

  const { query, display, start, sort } = event.queryStringParameters || {};

  console.log(
    `네이버 API로 요청: query=${query}, display=${display}, start=${start}, sort=${sort}`
  );

  try {
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/news.json",
      {
        params: { query, display, start, sort },
        headers: {
          "X-Naver-Client-Id": process.env.VITE_NAVER_CLIENT_ID || "",
          "X-Naver-Client-Secret": process.env.VITE_NAVER_CLIENT_SECRET || "",
        },
      }
    );

    console.log("네이버 API 응답 받음:", response.data);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("네이버 뉴스 API 요청 실패:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "네이버 뉴스 데이터를 가져오는 중 오류 발생",
      }),
    };
  }
};
