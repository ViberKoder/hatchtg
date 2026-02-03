// Telegram Web Chat Simulation
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let conversationStep = 0;
let hatched = false;
let lottieAnimation = null;
let eggMessageId = null;

// Start: Pavel sends egg after 1.5 seconds
setTimeout(() => {
    showEggMessage();
}, 1500);

function showEggMessage() {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    messageWrapper.id = 'eggMessage';
    
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
    
    const eggContainer = document.createElement('div');
    eggContainer.className = 'egg-container';
    
    // Load SVG egg
    fetch('egg.svg')
        .then(response => response.text())
        .then(svgText => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const svgElement = svgDoc.querySelector('svg');
            if (svgElement) {
                svgElement.setAttribute('class', 'egg');
                svgElement.setAttribute('id', 'egg');
                eggContainer.appendChild(svgElement);
            } else {
                // Fallback to emoji
                const egg = document.createElement('div');
                egg.className = 'egg';
                egg.id = 'egg';
                egg.textContent = '🥚';
                eggContainer.appendChild(egg);
            }
        })
        .catch(() => {
            // Fallback to emoji if SVG fails
            const egg = document.createElement('div');
            egg.className = 'egg';
            egg.id = 'egg';
            egg.textContent = '🥚';
            eggContainer.appendChild(egg);
        });
    
    const messageActions = document.createElement('div');
    messageActions.className = 'message-actions';
    
    const hatchBtn = document.createElement('button');
    hatchBtn.className = 'inline-btn';
    hatchBtn.id = 'hatchBtn';
    hatchBtn.textContent = 'Hatch';
    hatchBtn.addEventListener('click', () => handleHatch(messageBubble, eggContainer));
    
    messageActions.appendChild(hatchBtn);
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0');
    messageTime.textContent = timeStr;
    
    messageBubble.appendChild(eggContainer);
    messageBubble.appendChild(messageActions);
    messageBubble.appendChild(messageTime);
    
    messageContent.appendChild(messageBubble);
    message.appendChild(messageContent);
    messageWrapper.appendChild(message);
    
    messagesContainer.appendChild(messageWrapper);
    scrollToBottom();
    
    // Enable input after egg appears
    setTimeout(() => {
        messageInput.disabled = false;
        messageInput.placeholder = 'Write a message...';
    }, 500);
}

function showMessage(type, text, callback) {
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
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = text;
    messageBubble.appendChild(messageText);
    
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
                showMessage('incoming', 'Congratulations! You\'ve hatched your first egg! 🎉', () => {
                    setTimeout(() => {
                        showMessage('incoming', 'This is the future of gaming on Telegram. Earn while you play! 💰', () => {
                            setTimeout(() => {
                                showMessage('incoming', 'Want to learn more? Join our community! 👥', false);
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

// Handle user input
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        const text = messageInput.value.trim();
        if (text) {
            showMessage('outgoing', text, false);
            messageInput.value = '';
            scrollToBottom();
            
            // Check if user asked "what is it" or similar
            const lowerText = text.toLowerCase();
            if (lowerText.includes('what') || lowerText.includes('что')) {
                setTimeout(() => {
                    showMessage('incoming', 'Hatch it to find out!', false);
                }, 1000);
            }
        }
    }
});

sendBtn.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text) {
        showMessage('outgoing', text, false);
        messageInput.value = '';
        scrollToBottom();
        
        // Check if user asked "what is it" or similar
        const lowerText = text.toLowerCase();
        if (lowerText.includes('what') || lowerText.includes('что')) {
            setTimeout(() => {
                showMessage('incoming', 'Hatch it to find out!', false);
            }, 1000);
        }
    }
});

// Enable send button when typing
messageInput.addEventListener('input', () => {
    sendBtn.disabled = !messageInput.value.trim();
});
