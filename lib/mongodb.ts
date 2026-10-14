import { MongoClient } from "mongodb";

// 개발 모드(HMR)에서 연결이 계속 늘어나지 않도록 전역에 캐시합니다.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

export const dbName = process.env.MONGODB_DB ?? "portfolio";

export function hasMongoConfig(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다. .env.local 을 확인하세요.");
  }
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    }).connect();
  }
  return globalForMongo._mongoClientPromise;
}
