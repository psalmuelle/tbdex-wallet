export default function shortenText(
  text: string,
  prefixLength: number,
  suffixLength: number
): string {
  const shortenedText =
    text.substring(0, prefixLength) +
    "...." +
    text.substring(text.length - suffixLength);

  return shortenedText;
}
