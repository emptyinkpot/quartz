type EmojiMap = {
  codePointToName: Record<string, string>;
  nameToBase64: Record<string, string>;
};

let emojimap: EmojiMap | undefined = undefined;

function normalizeCodePoint(code: string): string {
  const upper = code.toUpperCase();
  const keycap = upper.match(/^([0-9A-F]{1,2})-20E3$/);
  if (!keycap) return upper;

  return `${keycap[1]!.padStart(4, "0")}-FE0F-20E3`;
}

export async function loadEmoji(code: string) {
  if (!emojimap) {
    const path = await import("node:path");
    const fs = await import("node:fs/promises");
    const mapPath = path.join("quartz", "util", "emojimap.json");
    const data = JSON.parse(await fs.readFile(mapPath, "utf-8"));
    emojimap = data;
  }

  const name = emojimap!.codePointToName[normalizeCodePoint(code)];
  if (!name) throw new Error(`codepoint ${code} not found in map`);

  const b64 = emojimap!.nameToBase64[name];
  if (!b64) throw new Error(`name ${name} not found in map`);

  return b64;
}
