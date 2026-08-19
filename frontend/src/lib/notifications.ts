/**
 * Browser notifications — requested in user feedback: "Would be great to get
 * notifications when a milestone is released." Opt-in only, no server needed.
 */

export type NotificationState = 'unsupported' | 'denied' | 'granted' | 'default';

export function notificationState(): NotificationState {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission as NotificationState;
}

/** Ask for permission. Returns true when notifications are now allowed. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** Show a notification when the page is in the background. */
export function notifyMilestone(title: string, body: string): void {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return;
  }
  try {
    new Notification(title, { body, tag: `cfx-${title}` });
  } catch {
    // Some environments construct but cannot display notifications.
  }
}
