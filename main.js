const serverUrl = 'https://shortly-allowing-stinkbug.ngrok-free.app/register';

// 유틸: base64 문자열 → Uint8Array 변환 함수
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

document.getElementById('subscribe').addEventListener('click', async () => {
  const classId = document.getElementById('class').value;

  const reg = await navigator.serviceWorker.register('sw.js');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Notification permission is required!');
    return;
  }

  const vapidPublicKey = 'BJ7atugHXd2PJdsiSD6EyzlcE1xEAU1GKhpLjPpeUUZTCKO8lAXzufwHyfLvWz6MTgx-EBQJVEE6ZXG2rq3R9TM';
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  });

  await fetch(serverUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      class_id: classId,
      subscription: subscription
    })
  });

  alert('Subscribed successfully!');
});
