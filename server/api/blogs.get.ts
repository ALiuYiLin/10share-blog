import { getBlogPaths } from "~~/utils";

export default defineEventHandler(async (event) => {
  return getBlogPaths()
});