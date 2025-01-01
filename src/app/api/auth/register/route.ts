import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email ve şifre gerekli" },
                { status: 400 }
            );
        }

        // Email formatını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Geçerli bir email adresi girin" },
                { status: 400 }
            );
        }

        // Şifre uzunluğunu kontrol et
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Şifre en az 6 karakter olmalıdır" },
                { status: 400 }
            );
        }

        // Email kullanımda mı kontrol et
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Bu email adresi zaten kullanımda" },
                { status: 400 }
            );
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kullanıcıyı oluştur
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Kayıt hatası:", error);
        return NextResponse.json(
            { error: "Kayıt işlemi başarısız" },
            { status: 500 }
        );
    }
} 