/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Default settings
const DEFAULT_KAKAO_ID = "@ismyhome";
const DEFAULT_KAKAO_URL_ID = "_ZTgGX/chat"; // The part after pf.kakao.com/

export function getKakaoId(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("kakao_channel_id");
    if (saved) return saved;
  }
  return DEFAULT_KAKAO_ID;
}

export function getKakaoUrlId(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("kakao_channel_url_id");
    // Seamlessly migrate outdated/broken default ID
    if (saved && saved !== "_ismyhome") return saved;
  }
  return DEFAULT_KAKAO_URL_ID;
}

export function getKakaoLink(): string {
  const urlId = getKakaoUrlId();
  // Ensure we have correct format
  const cleanId = urlId.startsWith("http") 
    ? urlId 
    : `https://pf.kakao.com/${urlId.startsWith("/") ? urlId.slice(1) : urlId}`;
  return cleanId;
}

export function setKakaoSettings(id: string, urlId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("kakao_channel_id", id.trim());
    
    let cleanUrlId = urlId.trim();
    // If user provided a full link, try to parse or keep it
    if (cleanUrlId.includes("pf.kakao.com/")) {
      const parts = cleanUrlId.split("pf.kakao.com/");
      if (parts[1]) {
        cleanUrlId = parts[1];
        if (cleanUrlId.startsWith("/")) {
          cleanUrlId = cleanUrlId.slice(1);
        }
      }
    }
    localStorage.setItem("kakao_channel_url_id", cleanUrlId);
  }
}
