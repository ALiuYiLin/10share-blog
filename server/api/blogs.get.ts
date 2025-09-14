import { getDocsPaths } from "@@/utils";

export default defineEventHandler(async (event) => {
  return getDocsPaths()
});