export function base64Encode(s) {
  return btoa(unescape(encodeURIComponent(s)));
}

export function base64Decode(s) {
  try {
    return decodeURIComponent(escape(atob(s)));
  } catch {
    return '';
  }
}
