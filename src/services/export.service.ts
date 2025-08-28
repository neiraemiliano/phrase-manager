import { Phrase } from "@/types";

export class ExportService {
  static exportToJSON(phrases: Phrase[]): void {
    const dataStr = JSON.stringify(phrases, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `phrases-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  static async importFromJSON(file: File): Promise<Phrase[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const phrases = JSON.parse(event.target?.result as string);
          resolve(phrases);
        } catch (error) {
          reject(new Error("Invalid JSON file"));
        }
      };

      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  }

  static exportToCSV(phrases: Phrase[]): void {
    const headers = [
      "ID",
      "Text",
      "Author",
      "Category",
      "Tags",
      "Likes",
      "Created At",
    ];
    const rows = phrases.map((p) => [
      p.id,
      `"${p.text.replace(/"/g, '""')}"`,
      p.author || "",
      p.category || "",
      p.tags.join(";"),
      p.likes || 0,
      p.createdAt,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `phrases-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.click();
  }
}
