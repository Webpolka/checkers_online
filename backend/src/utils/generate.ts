// server/utils/id.ts

/**
 * Генерирует случайный ID
 * @param length - длина ID (по умолчанию 4)
 * @param chars - набор символов для генерации (по умолчанию цифры "0-9")
 * @returns случайный ID строкой
 */
export function generateId(
  length: number = 4,
  chars: string = "0123456789"
): string {
  let id = "";
  const charsLength = chars.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    id += chars[randomIndex];
  }

  return id;
}
