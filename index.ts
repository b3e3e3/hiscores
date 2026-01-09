import { bodyIsValid, deleteAll, getScores, saveScore } from "./server";

const server = Bun.serve({
  routes: {
    "/": {
      GET: async (req) =>
        Response.json({
          status: 200,
          ...(await getScores()),
        }),
      POST: async (req) => {
        const body: any = await req.json();
        if (!bodyIsValid(body))
          return Response.json({
            status: 500,
            error: "Internal server error.",
          });

        try {
          const score: { name: string; score: number } = {
            ...body,
          };

          await saveScore(score.name, score.score);

          return Response.json({
            status: 200,
            ...score,
          });
        } catch (error) {
          console.log(error);
        }

        return Response.json({
          status: 500,
          error: "Internal server error.",
        });
      },
    },
    "/:start/:end": {
      GET: async (req) =>
        Response.json(
          ...(await getScores(
            parseInt(req.params.start),
            parseInt(req.params.end),
          )),
        ),
    },
    "/deleteallforreal": {
      GET: async (req) =>
        Response.json({
          status: 200,
          message: "All scores deleted successfully.",
        }),
    },
  },
});

console.log(
  `Running server on ${server.protocol}://${server.hostname}:${server.port}`,
);
