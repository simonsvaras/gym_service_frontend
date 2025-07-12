export const ProfilePhotoQuality = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
};

/**
 * Builds full URL to fetch a profile photo with desired quality.
 * @param {string} profilePhotoPath - Path returned from API (e.g. `/api/users/5/profilePhoto`).
 * @param {{id: *}} id
 * @param {string} quality - One of 'LOW', 'MEDIUM', 'HIGH'. Defaults to 'HIGH'.
 * @returns {string|null} Full URL or null if path is not provided.
 */
export function buildProfilePhotoUrl(profilePhotoPath, id, quality = ProfilePhotoQuality.HIGH) {
    if (profilePhotoPath == null) {
        return '/src/assets/basic_avatar2.png';
    }
    const baseUrl =
        import.meta.env.VITE_BACKEND_URL_API || 'http://localhost:8080/api';
    return `${baseUrl}/users/${id}/profilePhoto?quality=${quality}`;
}
