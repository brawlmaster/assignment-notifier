const serverUrl = 'https://bd97ed9c165a.ngrok-free.app/register'; // Replace with actual URL

document.getElementById('subscribe').addEventListener('click', async () => {
  const classId = document.getElementById('class').value;

  const reg = await navigator.serviceWorker.register('sw.js');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Notification permission is required!');
    return;
  }

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'BJ7CSXn_57DK3dsMW-570E-9Ziy7gMD-dOzimusE8x2bnbUa-aGVbF5JdirAdejSoiMvaLoRtOjbxPidY_w-XrQ'
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
