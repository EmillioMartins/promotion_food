import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";

type UserInput = {
  email?: unknown;
  name?: unknown;
};

function parseId(value: string): number | undefined {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidName(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

export class UserController {
  readonly list: RequestHandler = async (_request, response) => {
    const users = await prisma.user.findMany({
      include: { posts: true },
      orderBy: { id: "asc" },
    });
    response.json(users);
  };

  readonly getById: RequestHandler<{ id: string }> = async (request, response) => {
    const id = parseId(request.params.id);
    if (id === undefined) {
      response.status(400).json({ error: "O id deve ser um inteiro positivo." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
    if (!user) {
      response.status(404).json({ error: "Usuário não encontrado." });
      return;
    }
    response.json(user);
  };

  readonly create: RequestHandler<Record<string, never>, unknown, UserInput> = async (
    request,
    response,
  ) => {
    const body: unknown = request.body;
    if (
      !isRecord(body) ||
      !isValidEmail(body.email) ||
      (body.name !== undefined && !isValidName(body.name))
    ) {
      response.status(400).json({
        error: "Informe um e-mail válido e, opcionalmente, um nome textual ou nulo.",
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        ...(body.name === undefined ? {} : { name: body.name }),
      },
    });
    response.status(201).json(user);
  };

  readonly update: RequestHandler<{ id: string }, unknown, UserInput> = async (
    request,
    response,
  ) => {
    const id = parseId(request.params.id);
    const body: unknown = request.body;
    if (
      id === undefined ||
      !isRecord(body) ||
      Object.keys(body).length === 0 ||
      (body.email !== undefined && !isValidEmail(body.email)) ||
      (body.name !== undefined && !isValidName(body.name))
    ) {
      response.status(400).json({ error: "Id ou dados de atualização inválidos." });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.email === undefined ? {} : { email: body.email }),
        ...(body.name === undefined ? {} : { name: body.name }),
      },
    });
    response.json(user);
  };

  readonly remove: RequestHandler<{ id: string }> = async (request, response) => {
    const id = parseId(request.params.id);
    if (id === undefined) {
      response.status(400).json({ error: "O id deve ser um inteiro positivo." });
      return;
    }

    await prisma.user.delete({ where: { id } });
    response.status(204).end();
  };
}