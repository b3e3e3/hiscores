import { openDatabase, saveScore, getScores } from "./database";

const server = Bun.serve({
  routes: {
    "/": {
      GET: (req) => Response.json({ status: 200, ...getScores() }),
      POST: async (req) => {
        const body: any = await req.json();
        if (!body.name || !body.score)
          return Response.json({
            status: 500,
            error: "Internal server error.",
          });

        try {
          const score: { name: string; score: number } = {
            ...body,
          };

          saveScore(score.name, score.score);

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
      GET: (req) => {
        const start = parseInt(req.params.start);
        const end = parseInt(req.params.end);
        return Response.json({ status: 200, ...getScores(end, start) });
      },
    },
    "/deleteallforreal": {
      GET: async (req) => {
        try {
          using db = openDatabase();
          db.run(`DELETE FROM scores`);
        } catch (error) {
          console.log(error);
          return Response.json({
            status: 500,
            error: "Internal server error.",
          });
        }

        return Response.json({
          status: 200,
          message: "All scores deleted.",
        });
      },
    },
  },
});

console.log(
  `Running server on ${server.protocol}://${server.hostname}:${server.port}`,
);
