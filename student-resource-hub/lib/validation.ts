import { ResourceType } from "@prisma/client";

const MAX_NAME_LENGTH = 100;
const MAX_SLUG_LENGTH = 120;
const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_URL_LENGTH = 2048;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export type ResourceInput = {
  title: string;
  slug?: string;
  description: string;
  type: ResourceType;
  chapterId: string;
  url?: string | null;
  isPublished?: boolean;
};

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH);
}

export function validateNameAndSlug(input: { name: string; slug?: string }) {
  const name = input.name.trim();
  const slug = slugify(input.slug || name);

  if (!name || name.length > MAX_NAME_LENGTH) {
    throw new ValidationError("Name is required and must be 100 characters or fewer.");
  }

  if (!slug || slug.length > MAX_SLUG_LENGTH) {
    throw new ValidationError("A valid slug is required.");
  }

  return { name, slug };
}

export function validateResourceInput(input: ResourceInput) {
  const title = input.title.trim();
  const slug = slugify(input.slug || title);
  const description = input.description.trim();
  const chapterId = input.chapterId.trim();
  const url = input.url?.trim() || null;

  if (!title || title.length > MAX_TITLE_LENGTH) {
    throw new ValidationError("Resource title is required and must be 120 characters or fewer.");
  }

  if (!slug) throw new ValidationError("A valid resource slug is required.");

  if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
    throw new ValidationError("Resource description is required and must be 500 characters or fewer.");
  }

  if (!chapterId) throw new ValidationError("A chapter is required.");

  if (!Object.values(ResourceType).includes(input.type)) {
    throw new ValidationError("Invalid resource type.");
  }

  if (url) {
    if (url.length > MAX_URL_LENGTH) throw new ValidationError("Resource URL is too long.");
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new ValidationError();
    } catch {
      throw new ValidationError("Resource URL must be a valid HTTP or HTTPS URL.");
    }
  }

  return {
    title,
    slug,
    description,
    type: input.type,
    chapterId,
    url,
    isPublished: Boolean(input.isPublished),
  };
}
