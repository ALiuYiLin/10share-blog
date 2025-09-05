import fs from "fs";
import path from "path";
import { copySync, existsSync } from "fs-extra";

export async function readAllFilesAsync(dirPath: string) {
  const filePaths: string[] = [];

  // 读取当前目录下的 dirent 对象数组
  const items = await fs.readdirSync(dirPath, { withFileTypes: true });

  // 并行处理每个文件/目录（优化性能）
  await Promise.all(
    items.map(async (item) => {
      const fullPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        // 递归子目录，并将结果合并到当前数组
        const subFiles = await readAllFilesAsync(fullPath);
        filePaths.push(...subFiles);
      } else if (item.isFile()) {
        filePaths.push(fullPath);
      }
    })
  );
  return filePaths;
}

export function removeExtension(filePath: string) {
  // 标准化路径（处理冗余分隔符、末尾分隔符等）
  const normalizedPath = path.normalize(filePath);

  // 提取扩展名（含点，如 .txt）
  const ext = path.extname(normalizedPath);

  // 提取不带扩展名的文件名/目录名
  const basenameWithoutExt = path.basename(normalizedPath, ext);

  // 重组目录和文件名（无扩展名）
  const dir = path.dirname(normalizedPath);
  return path.join(dir, basenameWithoutExt);
}

export function copyDir(sourceDir: string, targetDir: string) {
  try {
    if (!existsSync(sourceDir)) {
      console.warn(`⚠️ 源目录不存在: ${sourceDir}`);
      return;
    }
    copySync(sourceDir, targetDir, {
      overwrite: true,
      errorOnExist: false,
    });
    console.log(`✅ 成功复制文件: ${sourceDir} → ${targetDir}`);
  } catch (error) {
    console.error(`❌ 复制失败: ${error}`);
    process.exit(1); // 复制失败时终止构建
  }
}
