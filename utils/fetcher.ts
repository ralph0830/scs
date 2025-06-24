export const mockCritters = [
  { id: 1, name: "아쿠아핀", level: 5, ownerId: 1, createdAt: new Date() },
  { id: 2, name: "플레임퍼", level: 3, ownerId: 1, createdAt: new Date() },
  { id: 3, name: "리프링", level: 8, ownerId: 1, createdAt: new Date() },
];

export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  const bodyText = await res.text();

  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    try {
      error.info = JSON.parse(bodyText);
    } catch (e) {
      error.info = { message: bodyText || res.statusText };
    }
    error.status = res.status;
    console.error('Fetcher error:', error.info);
    throw error;
  }

  if (!bodyText) {
    return null; // Handle empty successful response
  }

  try {
    return JSON.parse(bodyText);
  } catch (e) {
    console.error('Successful response with non-JSON body:', bodyText);
    throw new Error('Failed to parse successful response as JSON.');
  }
}; 