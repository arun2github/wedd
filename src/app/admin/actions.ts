"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSite, publishSite, setTemplate, unpublishSite } from "@/lib/dal";
import { demoWeddingContent } from "@/data/wedding-data";
import { TEMPLATES, DEFAULT_TEMPLATE_ID } from "@/lib/templates";

/**
 * Server actions for the console.
 *
 * Each one validates its input and then calls the DAL, which resolves the
 * session before it touches a table. Actions are public HTTP endpoints — being
 * imported only by an admin page authorises nothing — so nothing here assumes
 * the caller came from a page it rendered.
 */

/**
 * A slug becomes a public URL and can never be quietly changed afterwards
 * without breaking every invitation already sent. Hence the narrow shape:
 * lowercase, hyphen-separated, no leading or trailing hyphen.
 */
const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Use at least 3 characters.")
  .max(48, "Keep it under 48 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");

const templateSchema = z.string().refine((id) => id in TEMPLATES, "Unknown template.");

const createSchema = z.object({
  slug: slugSchema,
  brideName: z.string().trim().min(1, "Enter the bride's name.").max(60),
  groomName: z.string().trim().min(1, "Enter the groom's name.").max(60),
  templateId: templateSchema,
});

export type ActionState = { error?: string; fieldErrors?: Record<string, string[]> };

export async function createSiteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = createSchema.safeParse({
    slug: formData.get("slug"),
    brideName: formData.get("brideName"),
    groomName: formData.get("groomName"),
    templateId: formData.get("templateId") || DEFAULT_TEMPLATE_ID,
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { slug, brideName, groomName, templateId } = parsed.data;

  /*
    Seeded from the demo content with the real names swapped in, rather than
    started blank.

    A blank site is a wall of empty fields and nothing to show the customer. A
    seeded one is previewable in the first minute — the operator replaces the
    placeholder story and photos as the couple sends them, and can share a link
    before any of that arrives.
  */
  const content = {
    ...demoWeddingContent,
    couple: { ...demoWeddingContent.couple, brideName, groomName },
  };

  try {
    await createSite(slug, content, templateId);
  } catch (error) {
    /* The unique constraint on `slug` is the real check — testing for an
       existing row first would still race two operators typing the same name. */
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Unique constraint") || message.includes("P2002")) {
      return { fieldErrors: { slug: ["That address is already taken."] } };
    }
    return { error: "Could not create the site. Please try again." };
  }

  redirect(`/admin/${slug}`);
}

export async function publishAction(slug: string): Promise<ActionState> {
  try {
    await publishSite(slug);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not publish." };
  }
  revalidatePath(`/admin/${slug}`);
  revalidatePath("/admin");
  return {};
}

export async function unpublishAction(slug: string): Promise<ActionState> {
  await unpublishSite(slug);
  revalidatePath(`/admin/${slug}`);
  revalidatePath("/admin");
  return {};
}

export async function setTemplateAction(slug: string, templateId: string): Promise<ActionState> {
  const parsed = templateSchema.safeParse(templateId);
  if (!parsed.success) return { error: "Unknown template." };

  await setTemplate(slug, parsed.data);
  revalidatePath(`/admin/${slug}`);
  revalidatePath("/admin");
  return {};
}
