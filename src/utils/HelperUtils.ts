/**
 * Check if a string is a valid URL
 */
export const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

/**
 * Truncates string (in the middle) via given lenght value
 */
export function truncate(value?: string, length = 13) {
  if (!value) {
    return value;
  }
  if (value?.length <= length) {
    return value;
  }

  const separator = "...";
  const stringLength = length - separator.length;
  const frontLength = Math.ceil(stringLength / 2);
  const backLength = Math.floor(stringLength / 2);

  return (
    value.substring(0, frontLength) +
    separator +
    value.substring(value.length - backLength)
  );
}

/**
 * Extracts Ethereum address from a string
 */
export function extractEthAddress(inputString: string) {
  const ethAddressRegex = /0x[a-fA-F0-9]{40}/;
  const match = inputString.match(ethAddressRegex);
  return match ? match[0] : "";
}

export function numberWithCommas(input: string) {
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
