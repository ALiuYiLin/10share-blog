// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "path";
import fs from "fs-extra";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  hooks: {
    "build:before": () => {
      const sourceDir = path.resolve(process.cwd(), "blogs");
      const targetDir = path.resolve(process.cwd(), ".nuxt/blogs");
      try {
        if (!fs.existsSync(sourceDir)) {
          console.warn(`⚠️ 源目录不存在: ${sourceDir}`);
          return;
        }
        fs.copySync(sourceDir, targetDir, {
          overwrite: true,
          errorOnExist: false,
        });
        console.log(
          `✅ 成功复制文件到 .nuxt/xxxx 目录: ${sourceDir} → ${targetDir}`
        );
      } catch (error) {
        console.error(`❌ 复制失败: ${error}`);
        process.exit(1); // 复制失败时终止构建
      }
    },
  },
});
