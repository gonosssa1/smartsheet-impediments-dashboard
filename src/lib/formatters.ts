const KNOWN_NAMES: Record<string, string> = {
  "brandy.mcnalis": "Brandy McNalis",
  "chris.butterfield": "Chris Butterfield",
  "jamie.heard": "Jamie Heard",
  "matt.kohler": "Matt Kohler",
  "wade.harrison": "Wade Harrison",
  "glenn.onos": "Glenn Onos",
  "david.clark": "David Clark",
  "finley.blake": "Finley Blake",
};

export function emailToDisplayName(email: string | null): string {
  if (!email) return "Unknown";

  const trimmed = email.trim().toLowerCase();
  const localPart = trimmed.split("@")[0];

  if (KNOWN_NAMES[localPart]) {
    return KNOWN_NAMES[localPart];
  }

  // Fallback: parse first.last -> "First Last"
  const parts = localPart.split(".");
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function truncateText(text: string | null, maxLength: number = 80): string {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
