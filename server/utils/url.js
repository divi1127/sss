function getFullImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}${path}`;
}

function transformItem(item) {
  if (!item) return item;
  const obj = { ...item };
  if (obj.image_url) obj.image_url = getFullImageUrl(obj.image_url);
  if (obj.payment_screenshot_url) obj.payment_screenshot_url = getFullImageUrl(obj.payment_screenshot_url);
  if (obj.items) obj.items = obj.items.map(transformItem);
  return obj;
}

function transformArray(arr) {
  return arr.map(transformItem);
}

module.exports = { getFullImageUrl, transformItem, transformArray };
