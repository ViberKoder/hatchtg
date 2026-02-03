// Telegram Web Chat Simulation
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let conversationStep = 0;
let hatched = false;
let lottieAnimation = null;

// Conversation flow
const conversation = [
    {
        type: 'incoming',
        text: 'Hey, have you seen the first Send-2-Earn game in Telegram?',
        delay: 1000
    },
    {
        type: 'waiting',
        text: 'No, what is it?',
        delay: 2000
    },
    {
        type: 'incoming',
        text: '🥚',
        isEgg: true,
        delay: 1500
    },
    {
        type: 'incoming',
        text: 'Hatch it to find out!',
        delay: 1000
    }
];

// Initialize conversation
setTimeout(() => {
    startConversation();
}, 500);

function startConversation() {
    showMessage(conversation[0].type, conversation[0].text, false, false, () => {
        setTimeout(() => {
            showMessage(conversation[1].type, conversation[1].text, false, false, () => {
                setTimeout(() => {
                    showMessage(conversation[2].type, conversation[2].text, true, false, () => {
                        setTimeout(() => {
                            showMessage(conversation[3].type, conversation[3].text, false, false);
                        }, conversation[3].delay);
                    });
                }, conversation[2].delay);
            });
        }, conversation[1].delay);
    });
}

function showMessage(type, text, isEgg, isHatched, callback) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    
    if (type === 'incoming') {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'PD';
        message.appendChild(avatar);
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    if (isEgg) {
        const eggContainer = document.createElement('div');
        eggContainer.className = 'egg-container';
        
        if (isHatched) {
            // Show Lottie animation
            const lottieDiv = document.createElement('div');
            lottieDiv.className = 'lottie-container';
            lottieDiv.id = 'lottieContainer';
            eggContainer.appendChild(lottieDiv);
            
            loadLottieAnimation(lottieDiv);
        } else {
            const egg = document.createElement('div');
            egg.className = 'egg';
            egg.id = 'egg';
            egg.textContent = '🥚';
            eggContainer.appendChild(egg);
            
            const messageActions = document.createElement('div');
            messageActions.className = 'message-actions';
            
            const hatchBtn = document.createElement('button');
            hatchBtn.className = 'inline-btn';
            hatchBtn.id = 'hatchBtn';
            hatchBtn.textContent = 'Hatch';
            hatchBtn.addEventListener('click', () => handleHatch(messageBubble, eggContainer));
            
            messageActions.appendChild(hatchBtn);
            messageBubble.appendChild(messageActions);
        }
        
        messageBubble.appendChild(eggContainer);
    } else {
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = text;
        messageBubble.appendChild(messageText);
    }
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0');
    messageTime.textContent = timeStr;
    messageBubble.appendChild(messageTime);
    
    messageContent.appendChild(messageBubble);
    message.appendChild(messageContent);
    messageWrapper.appendChild(message);
    
    messagesContainer.appendChild(messageWrapper);
    scrollToBottom();
    
    if (callback) {
        setTimeout(callback, 100);
    }
}

function showTypingIndicator() {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const message = document.createElement('div');
    message.className = 'message incoming';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'PD';
    message.appendChild(avatar);
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingIndicator.appendChild(dot);
    }
    
    messageBubble.appendChild(typingIndicator);
    messageContent.appendChild(messageBubble);
    message.appendChild(messageContent);
    messageWrapper.appendChild(message);
    messageWrapper.id = 'typingIndicator';
    
    messagesContainer.appendChild(messageWrapper);
    scrollToBottom();
    
    return messageWrapper;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function handleHatch(messageBubble, eggContainer) {
    if (hatched) return;
    
    hatched = true;
    const hatchBtn = document.getElementById('hatchBtn');
    if (hatchBtn) {
        hatchBtn.disabled = true;
        hatchBtn.textContent = 'Hatching...';
    }
    
    const egg = document.getElementById('egg');
    if (egg) {
        egg.classList.add('hatching');
        
        setTimeout(() => {
            egg.classList.remove('hatching');
            eggContainer.innerHTML = '';
            
            const lottieDiv = document.createElement('div');
            lottieDiv.className = 'lottie-container';
            lottieDiv.id = 'lottieContainer';
            eggContainer.appendChild(lottieDiv);
            
            loadLottieAnimation(lottieDiv);
            
            setTimeout(() => {
                showMessage('incoming', 'Congratulations! You\'ve hatched your first egg! 🎉', false, false, () => {
                    setTimeout(() => {
                        showMessage('incoming', 'This is the future of gaming on Telegram. Earn while you play! 💰', false, false, () => {
                            setTimeout(() => {
                                showMessage('incoming', 'Want to learn more? Join our community! 👥', false, false);
                            }, 1500);
                        });
                    }, 1500);
                });
            }, 2000);
        }, 500);
    }
}

async function loadLottieAnimation(container) {
    try {
        // Load .tgs file
        const response = await fetch('ttgg.tgs');
        const arrayBuffer = await response.arrayBuffer();
        
        // .tgs files are gzip-compressed JSON, we need to decompress
        // Using pako library for decompression
        if (typeof pako !== 'undefined') {
            const decompressed = pako.inflate(arrayBuffer, { to: 'string' });
            const animationData = JSON.parse(decompressed);
            
            lottieAnimation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
            });
        } else {
            // Fallback: try to load as JSON directly (if file is already decompressed)
            try {
                const text = await response.text();
                const animationData = JSON.parse(text);
                
                lottieAnimation = lottie.loadAnimation({
                    container: container,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: animationData
                });
            } catch (e) {
                // If that fails, show emoji fallback
                container.innerHTML = '<div style="font-size: 80px;">🐣</div>';
            }
        }
    } catch (error) {
        console.error('Error loading Lottie animation:', error);
        // Fallback to emoji
        container.innerHTML = '<div style="font-size: 80px;">🐣</div>';
    }
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle user input (for future expansion)
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        const text = messageInput.value.trim();
        if (text) {
            showMessage('outgoing', text, false, false);
            messageInput.value = '';
            scrollToBottom();
        }
    }
});

sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text) {
        showMessage('outgoing', text, false, false);
        messageInput.value = '';
        scrollToBottom();
    }
});
