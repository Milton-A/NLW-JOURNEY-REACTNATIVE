import { FastifyInstance } from "fastify";
import { ClientError } from "./errors/client-error";
import { ZodError } from "zod";

type FastifyErrorHandle = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandle = (error, request, reply) => {
  console.log(error);
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Invalid Input", errors: error.flatten().fieldErrors });
  }
  if (error instanceof ClientError) {
    return reply.status(400).send({ message: error.message });
  }
  return reply.status(500).send({ message: "Internal Server Error" });
};
