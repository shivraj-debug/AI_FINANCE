import { seedTransactions } from "@/actions/seeds"

export async function GET() {
  const result = await seedTransactions();
  return Response.json(result);
}
