import { NextResponse } from "next/server";
import { pets } from "@/pets";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const pet = pets.find((p) => p.id === params.id);
  return NextResponse.json(pet);
}
