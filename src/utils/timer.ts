export const sleep = (seconds?: number) => new Promise((resolve) => setTimeout(resolve, (seconds || 1) * 1000));
