import type { Handler } from "@netlify/functions";
import { openDatabase, saveScore, getScores, bodyIsValid } from "../server";

export const handler: Handler = async (event, context) => {
  switch (event.httpMethod) {
    case "GET":
      return { statusCode: 200, body: JSON.stringify({ ...getScores() }) };
    case "POST":
      const body = JSON.parse(event.body || "");
      if (!bodyIsValid(body))
        return { statusCode: 500, body: "Malformed body." };

      try {
        const score: { name: string; score: number } = {
          name: body.name,
          score: body.score,
        };

        saveScore(score.name, score.score);

        return {
          statusCode: 200,
          body: JSON.stringify({
            ...score,
          }),
        };
      } catch (error) {
        console.log(error);
      }

      return { statusCode: 500 };
  }
};
