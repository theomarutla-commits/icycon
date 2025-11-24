class ChatWidget {
    constructor(tenantId) {
        this.tenantId = tenantId;
        this.conversationId = null;
        this.setupWidget();
        this.bindEvents();
    }

    setupWidget() {
        this.widget = document.createElement('div');
        this.widget.className = 'chat-widget';
        this.widget.innerHTML = `
            <div class="chat-header">
                <h3>Site Assistant</h3>
                <button class="minimize-btn">−</button>
            </div>
            <div class="chat-messages">
                <div class="assistant-message chat-message">
                    Hello! I'm your assistant. How can I help you today?
                </div>
                <div class="typing-indicator">Assistant is typing...</div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
            </div>
        `;
        document.body.appendChild(this.widget);

        // Cache elements
        this.messagesDiv = this.widget.querySelector('.chat-messages');
        this.input = this.widget.querySelector('input');
        this.sendButton = this.widget.querySelector('button');
        this.minimizeBtn = this.widget.querySelector('.minimize-btn');
        this.typingIndicator = this.widget.querySelector('.typing-indicator');
    }

    bindEvents() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        this.minimizeBtn.addEventListener('click', () => {
            this.widget.classList.toggle('minimized');
            this.minimizeBtn.textContent = this.widget.classList.contains('minimized') ? '+' : '−';
        });
    }

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        // Clear input and show user message
        this.input.value = '';
        this.addMessage(text, 'user');

        // Show typing indicator
        this.typingIndicator.classList.add('visible');
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;

        try {
            const response = await fetch('/api/chatbot/send/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCookie('csrftoken')
                },
                body: JSON.stringify({
                    tenant: this.tenantId,
                    message: text,
                    conversation: this.conversationId
                })
            });

            const data = await response.json();
            if (response.ok) {
                this.conversationId = data.conversation;
                this.addMessage(data.reply, 'assistant');
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
                console.error('Chat error:', data.error);
            }
        } catch (error) {
            console.error('Network error:', error);
            this.addMessage('Sorry, I had trouble connecting. Please try again.', 'assistant');
        }

        // Hide typing indicator
        this.typingIndicator.classList.remove('visible');
    }

    addMessage(text, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${role}-message chat-message`;
        messageDiv.textContent = text;
        this.messagesDiv.appendChild(messageDiv);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}