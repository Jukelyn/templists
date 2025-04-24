const formatTimestamp = (date: Date | null | undefined): string => {
  if (!date) return "";

  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

  if (diff < 60) return "Less than one minute ago";

  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes === 1 ? "One" : minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours === 1 ? "One" : hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days === 1 ? "One" : days} day${days === 1 ? "" : "s"} ago`;
  }

  // Fallback to date string if older than a week
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export default formatTimestamp;
