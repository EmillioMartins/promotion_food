import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";

type PostInput = {
  title?: unknown;
  content?: unknown;
  published?: unknown;
  authorId?: unknown;
};

function parseId(value: string): number | undefined {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidTitle(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidContent(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isValidAuthorId(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export class PostController {
  readonly list: RequestHandler = async (_request, response) => {
    const posts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { id: "asc" },
    });
    response.json(posts);
  };

  readonly getById: RequestHandler<{ id: string }> = async (request, response) => {
    const id = parseId(request.params.id);
    if (id === undefined) {
      response.status(400).json({ error: "O id deve ser um inteiro positivo." });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!post) {
      response.status(404).json({ error: "Publicação não encontrada." });
      return;
    }
    response.json(post);
  };

  readonly create: RequestHandler<Record<string, never>, unknown, PostInput> = async (
    request,
    response,
  ) => {
    const body: unknown = request.body;
    if (
      !isRecord(body) ||
      !isValidTitle(body.title) ||
      !isValidAuthorId(body.authorId) ||
      (body.content !== undefined && !isValidContent(body.content)) ||
      (body.published !== undefined && typeof body.published !== "boolean")
    ) {
      response.status(400).json({
        error: "Informe title, authorId válido e valores válidos para content e published.",
      });
      return;
    }

    const post = await prisma.post.create({
      data: {
        title: body.title.trim(),
        authorId: body.authorId,
        ...(body.content === undefined ? {} : { content: body.content }),
        ...(body.published === undefined ? {} : { published: body.published }),
      },
      include: { author: true },
    });
    response.status(201).json(post);
  };

  readonly update: RequestHandler<{ id: string }, unknown, PostInput> = async (
    request,
    response,
  ) => {
    const id = parseId(request.params.id);
    const body: unknown = request.body;
    if (
      id === undefined ||
      !isRecord(body) ||
      Object.keys(body).length === 0 ||
      (body.title !== undefined && !isValidTitle(body.title)) ||
      (body.content !== undefined && !isValidContent(body.content)) ||
      (body.published !== undefined && typeof body.published !== "boolean") ||
      (body.authorId !== undefined && !isValidAuthorId(body.authorId))
    ) {
      response.status(400).json({ error: "Id ou dados de atualização inválidos." });
      return;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(body.title === undefined ? {} : { title: body.title.trim() }),
        ...(body.content === undefined ? {} : { content: body.content }),
        ...(body.published === undefined ? {} : { published: body.published }),
        ...(body.authorId === undefined ? {} : { authorId: body.authorId }),
      },
      include: { author: true },
    });
    response.json(post);
  };

  readonly remove: RequestHandler<{ id: string }> = async (request, response) => {
    const id = parseId(request.params.id);
    if (id === undefined) {
      response.status(400).json({ error: "O id deve ser um inteiro positivo." });
      return;
    }

    await prisma.post.delete({ where: { id } });
    response.status(204).end();
  };
}