export const ProfilePhotoQuality = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
};

/**
 * Builds full URL to fetch a profile photo with desired quality.
 * @param {string} profilePhotoPath - Path returned from API (e.g. `/api/users/5/profilePhoto`).
 * @param {string} quality - One of 'LOW', 'MEDIUM', 'HIGH'. Defaults to 'HIGH'.
 * @returns {string|null} Full URL or null if path is not provided.
 */
export function buildProfilePhotoUrl(profilePhotoPath, quality = ProfilePhotoQuality.HIGH) {
    if (!profilePhotoPath) return null;
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const separator = profilePhotoPath.includes('?') ? '&' : '?';
    return `${baseUrl}${profilePhotoPath}${separator}quality=${quality}`;
}
