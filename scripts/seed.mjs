// 사용법: npm run seed
// data/sample.json 의 내용을 MongoDB에 넣습니다. 기존 profile / projects 는 교체됩니다.
import { readFile } from "node:fs/promises";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "portfolio";

if (!uri) {
  console.error("MONGODB_URI 가 없습니다. .env.example 을 .env.local 로 복사해 값을 채워 주세요.");
  process.exit(1);
}

const sample = JSON.parse(
  await readFile(new URL("../data/sample.json", import.meta.url), "utf8"),
);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

try {
  await client.connect();
  const db = client.db(dbName);

  await db.collection("profile").deleteMany({});
  await db.collection("profile").insertOne(sample.profile);

  await db.collection("projects").deleteMany({});
  await db.collection("projects").insertMany(sample.projects);

  await db.collection("projects").createIndex({ order: 1 });
  await db.collection("messages").createIndex({ createdAt: -1 });

  console.log(
    `완료: ${dbName} DB에 프로필 1건, 프로젝트 ${sample.projects.length}건을 저장했습니다.`,
  );
} catch (error) {
  console.error("시드 실패:", error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
