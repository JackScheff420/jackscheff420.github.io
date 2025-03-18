document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.slider .item');
    const infoSection = document.createElement('div');
    infoSection.className = 'info';
    infoSection.style.display = 'none';
    document.body.appendChild(infoSection);
    
    const imageData = [
        { title: "Meine alte Portfolio Seite", description: "Meine alte Portfolio Seite. Ich möchte sie trotzdem so online lassen um den Wandel der Seiten sehen zu können." },
        { title: "Sitzplatzbuchung", description: "Front-end für eine Simple Sitzplatzbuchung / Design Proof of concept" },
        { title: "Yachthafen Buchungssoftware", description: "Eine Projektarbeit für eine einfache Platzbuchungssoftware für einen Yachthafen" },
        { title: "Artikelverwaltung", description: "Eine Projektarbeit bei der Benutzer Artikeldaten in und aus einer Datenbank einsehen und verändern können" },
        { title: "Project 5", description: "Beschreibung für Projekt 5. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse." },
        { title: "Project 6", description: "Beschreibung für Projekt 6. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse." },
        { title: "Project 7", description: "Beschreibung für Projekt 7. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse." },
        { title: "Project 8", description: "Beschreibung für Projekt 8. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse." },
        { title: "Project 9", description: "Beschreibung für Projekt 9. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse." },
        { title: "Project 10", description: "Beschreibung für Projekt 10. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse." }
    ];
    
    infoSection.innerHTML = `
                <div class="infoImage">
                    <img src="" alt="Selected Project">
                </div>
                <div class="infotext">
                    <div class="author">Maximilian Scheffler</div>
                    <div class="title"></div>
                    <div class="topic">Web Entwickler</div>
                    <div class="des"></div>
                    <div class="buttons">
                        <button class="seeMore">SEE MORE</button>
                        <button class="back">BACK</button>
                    </div>
                </div>
            `;

    // Event listener for back button
    const backButton = infoSection.querySelector('.back');
    backButton.addEventListener('click', function() {
        // Create a fade-out effect
        infoSection.classList.add('fadeout');

        setTimeout(() => {
            infoSection.style.display = 'none';
            infoSection.classList.remove('fadeout');
            document.querySelector('.banner').style.display = 'block';
            // Resume the slider animation
            slider.style.animation = 'autoRun 20s linear infinite';
        }, 500);
    });

    // Event listener for see more button
    const seeMoreButton = infoSection.querySelector('.seeMore');
    seeMoreButton.addEventListener('click', function() {
        // Hier kannst du eine Funktion hinzufügen, die zu einer detaillierteren Projektseite führt
        alert('Weiterleitung zur Projektdetailseite...');
    });

    // Add click event for each image
    items.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Get the position of the clicked item
            const position = this.style.getPropertyValue('--position');

            // Pause the animation
            slider.style.animation = 'none';

            // Calculate the rotation needed to bring the clicked item to front
            const itemCount = parseInt(slider.style.getPropertyValue('--quantity'));
            const targetRotation = -(parseInt(position) - 1) * (360 / itemCount);

            // Get current rotation
            const currentRotation = getCurrentRotation(slider);

            // Determine the shortest rotation path
            let rotationDiff = targetRotation - currentRotation;

            // Normalize rotation to -180 to 180 range to get shortest path
            while (rotationDiff > 180) rotationDiff -= 360;
            while (rotationDiff < -180) rotationDiff += 360;

            const finalRotation = currentRotation + rotationDiff;

            // Apply smooth rotation using CSS transition
            slider.style.transition = 'transform 1s ease-in-out';
            slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${finalRotation}deg)`;

            // Wait for the rotation to complete
            setTimeout(() => {
                // Add fade-out effect to banner
                document.querySelector('.banner').classList.add('fadeout');

                setTimeout(() => {
                    // Hide banner and remove fade-out class
                    document.querySelector('.banner').style.display = 'none';
                    document.querySelector('.banner').classList.remove('fadeout');

                    // Show info section
                    infoSection.style.display = 'flex';

                    // Reset any previous animations
                    const infoElements = infoSection.querySelectorAll('.infotext > *');
                    infoElements.forEach(el => {
                        el.style.animation = 'none';
                        el.offsetHeight; // Trigger reflow
                    });

                    // Set the selected image and text
                    const selectedImg = this.querySelector('img').src;
                    infoSection.querySelector('.infoImage img').src = selectedImg;
                    infoSection.querySelector('.title').textContent = imageData[index].title;
                    infoSection.querySelector('.des').textContent = imageData[index].description;

                    // Reset animation for next use
                    infoSection.querySelector('.infoImage img').style.animation = 'none';
                    infoSection.querySelector('.infoImage img').offsetHeight; // Trigger reflow
                    infoSection.querySelector('.infoImage img').style.animation = 'fadeInScale 0.8s ease forwards';

                    // Reapply animations to text elements
                    infoElements.forEach(el => {
                        el.style.animation = '';
                    });
                }, 500);
            }, 1000); // Wait for rotation to complete
        });
    });

    // Function to get current rotation value
    function getCurrentRotation(element) {
        // Get the current transform style
        const style = window.getComputedStyle(element);
        const matrix = style.transform || style.webkitTransform || style.mozTransform;

        // No transform set, return 0
        if (matrix === 'none' || matrix === '') {
            return 0;
        }

        // Extract rotation from matrix
        const values = matrix.split('(')[1].split(')')[0].split(',');
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        const c = parseFloat(values[2]);
        const d = parseFloat(values[3]);

        // For 3D transforms, we need to use a different approach
        // This is a simplified approach that works for rotateY
        if (values.length > 6) {
            const angle = Math.atan2(parseFloat(values[6]), parseFloat(values[0]));
            return angle * (180 / Math.PI);
        }

        // For 2D transforms
        const angle = Math.atan2(b, a);
        return angle * (180 / Math.PI);
    }
});