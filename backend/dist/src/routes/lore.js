"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loreRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function loreRoutes(fastify) {
    /**
     * GET /api/lore
     * List view for cards
     */
    fastify.get("/api/lore", async () => {
        return prisma.lore.findMany({
            orderBy: [{ title: "asc" }],
            select: {
                id: true,
                slug: true,
                title: true,
                era: true,
                imageUrl: true,
            },
        });
    });
    /**
     * GET /api/lore/slug/:slug
     * Detail view
     */
    fastify.get("/api/lore/slug/:slug", async (request, reply) => {
        const lore = await prisma.lore.findUnique({
            where: { slug: request.params.slug },
            include: { tags: true },
        });
        if (!lore) {
            return reply.code(404).send({ message: "Lore entry not found" });
        }
        return lore;
    });
}
