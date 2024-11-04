export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();

  // Check if the date is today or within the last 24 hours
  const isToday = date.toDateString() === now.toDateString();
  const isWithin24Hours = now.getTime() - date.getTime() < 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (isToday || isWithin24Hours) {
    // Return time in 12-hour format with AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes} ${amPm}`;
  } else {
    // Return date in dd/mm/yy format
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  }
};


export function debounce <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}