import fs from 'fs';

const content = fs.readFileSync("./extensions.json", "utf8");
const extensionMap = JSON.parse(content);

export const getAutoLanguage = (pasteName) => {
  const idx = pasteName.lastIndexOf(".");
  if (idx < 0) return "plaintext";
  return extensionMap[pasteName.substring(idx)] ?? "plaintext";
};
