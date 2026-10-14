import { NextResponse } from "next/server";
import { getPortfolio } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const { projects, source } = await getPortfolio();
  return NextResponse.json({ source, projects });
}
