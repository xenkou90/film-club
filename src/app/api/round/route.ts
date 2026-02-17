import { NextResponse } from "next/server";
import { round } from "@/lib/store";

export async function GET() {
    return NextResponse.json(round);
}