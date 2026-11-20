/** Admin oturumunun tarayıcıda tutulan bilgileri. */
const SESSION_KEYS = ['admin_token', 'admin_id', 'admin_username', 'admin_role', 'admin_permissions'];

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  SESSION_KEYS.forEach(key => localStorage.removeItem(key));
}

/**
 * Sunucunun ürettiği token 64 karakterlik hex'tir. Eski sürümün "fake-jwt-token-..." değerleri artık geçersiz;
 * böyle bir değer görülürse kullanıcı doğrudan girişe yönlendirilir (paneli açınca art arda hata görmesin).
 */
export function hasValidAdminTokenFormat(token: string | null): boolean {
  return !!token && /^[a-f0-9]{64}$/.test(token);
}
