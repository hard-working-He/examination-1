import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, name } = body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name },
    });
    return Response.json(user);
  } catch {
    return new Response("Error updating user", { status: 500 });
  }
} 