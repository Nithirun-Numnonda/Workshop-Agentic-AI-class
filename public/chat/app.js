let history = [];

const form = document.getElementById('composer');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const chatBox = document.getElementById('chat-box');
const errorBox = document.getElementById('error');

function addMessage(role, content) {
    const message = document.createElement('div');
    message.className = `message ${role}`;
    const label = document.createElement('span');
    label.className = 'role';
    label.textContent = role === 'user' ? 'You' : 'Assistant';
    message.append(label, document.createTextNode(content));
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function setBusy(isBusy) {
    input.disabled = isBusy;
    sendButton.disabled = isBusy;
    sendButton.textContent = isBusy ? 'Thinking…' : 'Send  ↗';
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || sendButton.disabled) return;

    const provider = document.getElementById('provider').value;
    const model = document.getElementById('model').value.trim();
    chatBox.querySelector('.empty')?.remove();
    errorBox.hidden = true;
    history.push({ role: 'user', content: message });
    addMessage('user', message);
    input.value = '';
    setBusy(true);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history, provider, model })
        });
        const data = await response.json();
        if (!response.ok || !data.reply) throw new Error(data.error || 'The assistant could not respond.');
        history.push({ role: 'assistant', content: data.reply });
        addMessage('assistant', data.reply);
    } catch (error) {
        errorBox.textContent = error.message || 'Something went wrong. Please try again.';
        errorBox.hidden = false;
    } finally {
        setBusy(false);
        input.focus();
    }
});

input.focus();
