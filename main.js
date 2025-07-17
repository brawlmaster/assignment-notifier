const serverUrl = 'https://shortly-allowing-stinkbug.ngrok-free.app/register';


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
    alert('알림 권한이 필요합니다.');
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

  alert('성곡적으로 가입하였습니다.');
});
document.getElementById('unsubscribe').addEventListener('click', async () => {
  const reg = await navigator.serviceWorker.ready;

  const subscription = await reg.pushManager.getSubscription();
  if (subscription) {
    const success = await subscription.unsubscribe();
    if (success) {
      alert("알림 미수신 완료");

      // 서버에서도 subscription 제거 요청 (선택)
      await fetch('https://shortly-allowing-stinkbug.ngrok-free.app/unregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
    } else {
      alert("탈퇴 실패, 다시 시도해주세요.");
    }
  } else {
    alert("퇄퇴 성공.");
  }
});
