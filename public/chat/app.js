let history = [];

async function send() {
    const input = document.getElementById('input');
    const provider = document.getElementById('provider').value;
    const model = document.getElementById('model').value;
    const chatBox = document.getElementById('chat-box');
    
    if (!input.value) return;

    const message = input.value;
    history.push({ role: 'user', content: message });
    chatBox.innerHTML += `<div class="message"><span class="user">User:</span> ${message}</div>`;
    input.value = '';

    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, provider, model })
    });

    const data = await res.json();
    history.push({ role: 'assistant', content: data.reply });
    chatBox.innerHTML += `<div class="message"><span class="assistant">Assistant:</span> ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}
