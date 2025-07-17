const serverUrl = 'https://edd3a51f055e.ngrok-free.app/register'; // Replace with actual URL

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
    applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>'
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
