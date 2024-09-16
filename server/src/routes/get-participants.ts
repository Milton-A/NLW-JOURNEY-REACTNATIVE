import dayjs from "dayjs";
import { prisma } from "../lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../errors/client-error";

export const getParticipants = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/participants",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          Participant: {
            select: {
              id: true,
              name: true,
              email: true,
              is_confirmad: true,
            },
          },
        },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      return { participants: trip.Participant };
    }
  );
};
