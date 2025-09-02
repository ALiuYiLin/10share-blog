import fs from "fs";
import { createMarkdownInstance } from "../../utils";
export interface RenderBody {
  content: string;
}
export default defineEventHandler(async (event) => {
  const body = await readBody<RenderBody>(event);
  const md = await createMarkdownInstance();
  const content = await fs.readFileSync("content/example/index.md", "utf-8");
  return await md.renderAsync(content);
});
