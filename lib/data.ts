import sample from "@/data/sample.json";
import { dbName, getClient, hasMongoConfig } from "./mongodb";
import type { Portfolio, Profile, Project } from "./types";

const samplePortfolio: Portfolio = {
  profile: sample.profile as Profile,
  projects: sample.projects as Project[],
  source: "sample",
};

/**
 * MongoDB에서 프로필과 프로젝트를 읽어옵니다.
 * 환경 변수가 없거나 연결에 실패하면 샘플 데이터로 대체해
 * DB를 준비하기 전에도 화면을 확인할 수 있습니다.
 */
export async function getPortfolio(): Promise<Portfolio> {
  if (!hasMongoConfig()) return samplePortfolio;

  try {
    const client = await getClient();
    const db = client.db(dbName);

    const [profile, projects] = await Promise.all([
      db.collection("profile").findOne({}, { projection: { _id: 0 } }),
      db
        .collection("projects")
        .find({}, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray(),
    ]);

    if (!profile) return samplePortfolio;

    return {
      profile: profile as unknown as Profile,
      projects: projects as unknown as Project[],
      source: "mongodb",
    };
  } catch (error) {
    console.error("[portfolio] MongoDB 조회에 실패해 샘플 데이터를 사용합니다:", error);
    return samplePortfolio;
  }
}
