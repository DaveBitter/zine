export function getPageLabel(logicalPage: number, totalPages: number): string {
  if (logicalPage === 1) return "Front Cover";
  if (logicalPage === totalPages) return "Back Cover";
  return `Page ${logicalPage}`;
}
