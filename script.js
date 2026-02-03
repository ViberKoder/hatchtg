document.addEventListener('DOMContentLoaded', function() {
    const hatchBtn = document.getElementById('hatchBtn');
    const egg = document.getElementById('egg');
    let hatched = false;

    hatchBtn.addEventListener('click', function() {
        if (hatched) return;
        
        hatched = true;
        hatchBtn.disabled = true;
        hatchBtn.textContent = 'Hatched!';
        
        // Hatching animation
        egg.classList.add('hatching');
        
        setTimeout(() => {
            egg.classList.remove('hatching');
            egg.classList.add('hatched');
            
            // Replace egg with hatched creature
            setTimeout(() => {
                const creatures = ['🐣', '🐤', '🐥', '🦆', '🐔', '🦅'];
                const randomCreature = creatures[Math.floor(Math.random() * creatures.length)];
                egg.textContent = randomCreature;
                egg.style.transform = 'scale(1)';
            }, 500);
        }, 500);
    });

    // Hover effect on egg
    egg.addEventListener('mouseenter', function() {
        if (!hatched) {
            egg.style.transform = 'scale(1.1)';
        }
    });

    egg.addEventListener('mouseleave', function() {
        if (!hatched) {
            egg.style.transform = 'scale(1)';
        }
    });
});
