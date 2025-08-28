"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const prisma_1 = require("@/lib/prisma");
async function POST(req) {
    try {
        const body = await req.json();
        const { id, name } = body;
        // 验证输入
        if (!id || !name) {
            return new Response("Missing id or name", { status: 400 });
        }
        // 检查用户是否存在
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { id: Number(id) },
        });
        if (!existingUser) {
            return new Response(`User with id ${id} not found`, { status: 404 });
        }
        // 更新用户
        const user = await prisma_1.prisma.user.update({
            where: { id: Number(id) },
            data: { name },
        });
        return Response.json(user);
    }
    catch (error) {
        console.error("Error updating user:", error);
        return new Response(`Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
}
