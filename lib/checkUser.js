import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./prisma";

export const checkUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  try {
    // 🔥 Check if user exists
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // If user doesn't exist (rare case)
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
      });
    }

    return user;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};