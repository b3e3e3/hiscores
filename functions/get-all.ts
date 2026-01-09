import { openDatabase, saveScore, getScores, bodyIsValid } from "../../server";

exports.handler = async (event, context) => {
  switch (event.httpMethod) {
    case "GET":
      return { statusCode: 200, body: { ...getScores() } };
    case "POST":
      const body = JSON.parse(event.body);
      if (!bodyIsValid(body)) return { statusCode: 500 };

      try {
        const score: { name: string; score: number } = {
          ...body,
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
