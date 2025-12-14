"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shipsRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function shipsRoutes(fastify) {
    fastify.get("/api/ships", async () => {
        return prisma.ship.findMany({
            orderBy: { name: "asc" },
            include: {
                tags: {
                    select: { id: true, name: true },
                },
            },
        });
    });
    fastify.get("/api/ships/slug/:slug", async (request, reply) => {
        const { slug } = request.params;
        const ship = await prisma.ship.findUnique({
            where: { slug },
            include: {
                tags: {
                    select: { id: true, name: true },
                },
                primaryCrew: {
                    select: {
                        slug: true,
                        name: true,
                        callsign: true,
                        role: true,
                        primaryFaction: {
                            select: { slug: true, name: true },
                        },
                    },
                },
            },
        });
        if (!ship) {
            reply.code(404);
            return { message: "Ship not found" };
        }
        return ship;
    });
}
