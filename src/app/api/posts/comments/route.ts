import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Yorum ekleme
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Yorum yapmak için giriş yapmanız gerekiyor" },
                { status: 401 }
            );
        }

        const { postId, content } = await request.json();
        if (!postId || !content) {
            return NextResponse.json(
                { error: "Post ID ve yorum içeriği gerekli" },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Yorum ekleme hatası:", error);
        return NextResponse.json(
            { error: "Yorum eklenirken bir hata oluştu" },
            { status: 500 }
        );
    }
}

// Yorumları getirme
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID gerekli" },
                { status: 400 }
            );
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Yorumları getirme hatası:", error);
        return NextResponse.json(
            { error: "Yorumlar alınırken bir hata oluştu" },
            { status: 500 }
        );
    }
} 