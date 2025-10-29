'use server'

import webpush from 'web-push'

type WebPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

const subscriptions = new Map<string, WebPushSubscription>()

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_MAILTO || 'mailto:admin@serenemind.app',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function subscribeUser(subscription: WebPushSubscription) {
  try {
    const endpoint = subscription.endpoint
    subscriptions.set(endpoint, subscription)
    return { success: true, message: 'Subscription saved' }
  } catch (error) {
    console.error('Error saving subscription:', error)
    return { success: false, message: 'Failed to save subscription' }
  }
}

export async function unsubscribeUser(endpoint: string) {
  try {
    subscriptions.delete(endpoint)
    return { success: true, message: 'Unsubscribed successfully' }
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return { success: false, message: 'Failed to unsubscribe' }
  }
}

export async function sendNotification(message: string, title: string = 'SereneMind') {
  try {
    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'serenemind-notification',
      data: { url: '/' }
    })

    const promises = Array.from(subscriptions.values()).map(subscription =>
      webpush.sendNotification(subscription, payload).catch((error: unknown) => {
        console.error('Error sending notification:', error)
        if (error && typeof error === 'object' && 'statusCode' in error) {
          const statusCode = (error as { statusCode: number }).statusCode
          if (statusCode === 410 || statusCode === 404) {
            subscriptions.delete(subscription.endpoint)
          }
        }
      })
    )

    await Promise.all(promises)
    return { success: true, message: `Sent to ${subscriptions.size} subscribers` }
  } catch (error) {
    console.error('Error sending notifications:', error)
    return { success: false, message: 'Failed to send notifications' }
  }
}

export async function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || ''
}
