// Avatar helper for privacy-safe demo photos
export function getAvatarUrl(name, id) {
  // Use UI Avatars service for consistent, privacy-safe avatars
  const cleanName = name.replace(/[^a-zA-Z\s]/g, '').trim();
  const initials = cleanName.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  // Generate consistent colors based on ID
  const colors = ['3498db', '2ecc71', 'e74c3c', 'f39c12', '9b59b6', '1abc9c', 'e67e22'];
  const colorIndex = id % colors.length;
  const bgColor = colors[colorIndex];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=${bgColor}&color=ffffff&size=200&bold=true`;
}

// Alternative avatar services you can use:
// export const getAvatarUrl = (name, id) => `https://robohash.org/${id}?set=set1`;
// export const getAvatarUrl = (name, id) => `https://avatars.dicebear.com/api/initials/${encodeURIComponent(name)}.svg`;
