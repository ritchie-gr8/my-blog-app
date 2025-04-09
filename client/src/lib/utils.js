import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isTokenExpired(token) {
  if (!token) return true;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    return payload.exp ? payload.exp * 1000 < Date.now() : true;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
}

export function formatDate(date) {
    const formattedDate = dayjs(date).isAfter(dayjs().subtract(1, 'day'))
    ? dayjs(date).fromNow()
    : dayjs(date).format('DD MMMM YYYY [at] HH:mm');

  return formattedDate;
}

export const decodeNotificationMessage = (encodedMessage) => {
  if (!encodedMessage) return null;
  
  const parts = encodedMessage.split('#');
  if (parts.length !== 6) return null;

  try {
    const [actorLength, actorName, actionLength, action, titleLength, title] = parts;
    
    if (parseInt(actorLength) !== actorName.length ||
        parseInt(actionLength) !== action.length ||
        parseInt(titleLength) !== title.length) {
      return null;
    }

    return {
      actorName,
      action,
      title
    };
  } catch (error) {
    console.error('Error decoding notification message:', error);
    return null;
  }
};
