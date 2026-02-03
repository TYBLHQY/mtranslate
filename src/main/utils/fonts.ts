import { execSync } from "child_process";
import { platform } from "os";

export function getSystemFonts(): string[] {
  const os = platform();
  try {
    if (os === "darwin") {
      // macOS: Use system fonts from /Library/Fonts and ~/Library/Fonts
      const fontsDirs = ["/Library/Fonts", "~/Library/Fonts"];
      const fontFiles: string[] = [];

      for (const dir of fontsDirs) {
        try {
          const expandedDir = dir.replace("~", process.env.HOME || "");
          const output = execSync(`ls "${expandedDir}" 2>/dev/null || true`, {
            encoding: "utf8",
          });
          fontFiles.push(
            ...output
              .split("\n")
              .filter(f => /\.(ttf|otf)$/i.test(f))
              .map(f => f.replace(/\.(ttf|otf)$/i, "")),
          );
        } catch {
          // Ignore errors for individual dirs
        }
      }

      return Array.from(new Set(fontFiles)).sort();
    } else if (os === "linux") {
      // Linux: Use fc-list to query fonts
      try {
        const output = execSync("fc-list : family", { encoding: "utf8" });
        const fonts = output
          .split("\n")
          .filter(line => line.trim().length > 0)
          .map(line => line.split(",")[0].trim())
          .filter((f, i, arr) => arr.indexOf(f) === i); // Deduplicate

        return fonts.sort();
      } catch {
        return getCommonFonts();
      }
    } else if (os === "win32") {
      // Windows: Query registry for fonts
      try {
        const output = execSync(
          'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts" /s',
          { encoding: "utf8" },
        );
        const fontNames = output
          .split("\n")
          .filter(line => line.includes("REG_SZ"))
          .map(line => {
            const match = line.match(/\s+(.+?)\s+(REG_SZ)/);
            return match ? match[1].replace(/\s*\(TrueType\)$/, "") : "";
          })
          .filter(f => f.length > 0);

        return Array.from(new Set(fontNames)).sort();
      } catch {
        return getCommonFonts();
      }
    }
  } catch {
    return getCommonFonts();
  }

  return getCommonFonts();
}

function getCommonFonts(): string[] {
  return [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Trebuchet MS",
    "Impact",
    "Comic Sans MS",
    "Palatino",
    "Garamond",
    "Bookman",
    "Segoe UI",
    "Tahoma",
    "Microsoft Sans Serif",
    "Liberation Sans",
    "Droid Sans",
    "Ubuntu",
    "DejaVu Sans",
    "Noto Sans",
    "Noto Sans CJK SC",
    "Noto Sans CJK TC",
    "SimSun",
    "Microsoft YaHei",
    "WenQuanYi Zen Hei",
  ];
}
