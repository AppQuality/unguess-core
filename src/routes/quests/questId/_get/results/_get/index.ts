/**  OPENAPI-ROUTE : get-quests-questId-results */
import { Context } from "openapi-backend";
import * as db from "@src/features/db";
import { Response200, Response400, Params } from "./types";

type StepTypes = "media";
export default async (
  c: Context,
  req: OpenapiRequest,
  res: OpenapiResponse
): Promise<Response200 | Response400> => {
  const { questId } = c.request.params as Params;
  const quest = await getQuestById();
  if (!quest) {
    res.status_code = 400;
    return { error: "quest not found" };
  }

  const results = await getResults();
  const enhancedResults = await enhanceResults();

  res.status_code = 200;
  return enhancedResults;

  async function enhanceResults() {
    const output = [];
    const mediaResultsInfo = await getMediaResultsInfo();
    for (const r of results) {
      switch (r.step.type) {
        case "media":
          const mediaResult = mediaResultsInfo.find(
            (m) => m.result_id === r.step.id
          );
          if (!mediaResult) break;
          output.push({
            ...r,
            item: { path: mediaResult.path },
          });
          break;
        default:
          throw new Error("Unknown step type");
      }
    }
    return output;
  }

  async function getMediaResultsInfo(): Promise<
    { id: number; result_id: number; path: string }[]
  > {
    const mediaResultsId = results
      .filter((r) => r.step.type === "media")
      .map((r) => r.step.id);
    if (!mediaResultsId.length) return [];
    return await db.query(
      `SELECT id,result_id,path FROM results_media WHERE result_id IN (${mediaResultsId.join(
        ","
      )})`
    );
  }

  async function getResults() {
    const result: {
      id: number;
      type: StepTypes;
      approved: 0 | 1;
      author_id: string | null;
      author_src: string | null;
    }[] = await db.query(
      db.format(
        `SELECT r.id,s.type,r.approved,r.author_id,r.author_src FROM results r
    JOIN steps s ON r.step_id = s.id
    WHERE s.quest_id = ?`,
        [questId]
      )
    );
    return result.map((r) => ({
      step: { id: r.id, type: r.type },
      approved: r.approved === 1,
      author: isValidAuthor(r)
        ? { id: r.author_id, source: r.author_src }
        : undefined,
    }));

    function isValidAuthor(r: {
      author_id: string | null;
      author_src: string | null;
    }): r is { author_id: string; author_src: "tryber" } {
      return !!r.author_id && !!r.author_src && r.author_src === "tryber";
    }
  }

  async function getQuestById(): Promise<{ id: number } | false> {
    const quest = await db.query(
      db.format(`SELECT * FROM quests WHERE id = ?`, [questId])
    );
    if (!quest.length) {
      return false;
    }
    return quest[0];
  }
};
