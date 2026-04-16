const API_KEY = "AIzaSyD5O-MrvnSR5a3WfcMFPuerX2TQne-XPxw";

async function test() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: "A futuristic city" }],
      parameters: { sampleCount: 1, aspectRatio: "1:1" }
    })
  });
  const data = await response.json();
  console.log(JSON.stringify(data).substring(0, 500));
}
test();
