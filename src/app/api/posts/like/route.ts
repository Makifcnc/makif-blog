import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Giriş yapmanız gerekiyor" },
                { status: 401 }
            );
        }

        const { postId } = await request.json();
        if (!postId) {
            return NextResponse.json(
                { error: "Post ID gerekli" },
                { status: 400 }
            );
        }

        // Beğeni var mı kontrol et
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId: session.user.id,
                },
            },
        });

        if (existingLike) {
            // Beğeni varsa kaldır
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return NextResponse.json({ liked: false });
        }

        // Beğeni yoksa ekle
        await prisma.like.create({
            data: {
                postId,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ liked: true });
    } catch (error) {
        console.error("Beğeni hatası:", error);
        return NextResponse.json(
            { error: "Beğeni işlemi başarısız" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("postId");
        const session = await getServerSession(authOptions);

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID gerekli" },
                { status: 400 }
            );
        }

        // Toplam beğeni sayısını al
        const likesCount = await prisma.like.count({
            where: {
                postId,
            },
        });

        // Kullanıcı giriş yapmışsa, beğenip beğenmediğini kontrol et
        let userLiked = false;
        if (session?.user?.id) {
            const userLike = await prisma.like.findUnique({
                where: {
                    postId_userId: {
                        postId,
                        userId: session.user.id,
                    },
                },
            });
            userLiked = !!userLike;
        }

        return NextResponse.json({
            likesCount,
            userLiked,
        });
    } catch (error) {
        console.error("Beğeni bilgisi hatası:", error);
        return NextResponse.json(
            { error: "Beğeni bilgisi alınamadı" },
            { status: 500 }
        );
    }
} 