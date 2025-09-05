import fs from "fs";
import { createMarkdownInstance } from "@@/utils";

export default defineEventHandler(async (event) => {
  const slug = event.context.params!.slug;
  if(!slug) return ''
  const md = await createMarkdownInstance();
  const content = await fs.readFileSync(`blogs/${slug}.md`, "utf-8");
  return await md.renderAsync(content);
});
