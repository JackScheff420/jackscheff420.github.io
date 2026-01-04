document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.slider .item');
    const infoSection = document.createElement('div');
    infoSection.className = 'info';
    infoSection.style.display = 'none';
    document.body.appendChild(infoSection);
    
    // Track animation timing for accurate rotation calculation
    let animationStartTime = Date.now();
    
    // Load project data from JSON file
    let imageData = [];
    
    // Fetch project data
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            imageData = data.projects;
        })
        .catch(error => {
            console.error('Error loading project data:', error);
            // Fallback data if JSON fails to load
            imageData = [
                { title: "Meine alte Portfolio Seite", description: "Meine alte Portfolio Seite. Ich möchte sie trotzdem so online lassen um den Wandel der Seiten sehen zu können.", websiteUrl: null, githubUrl: null },
                { title: "Sitzplatzbuchung", description: "Front-end für eine Simple Sitzplatzbuchung / Design Proof of concept", websiteUrl: null, githubUrl: null },
                { title: "Yachthafen Buchungssoftware", description: "Eine Projektarbeit für eine einfache Platzbuchungssoftware für einen Yachthafen", websiteUrl: null, githubUrl: null },
                { title: "Artikelverwaltung", description: "Eine Projektarbeit bei der Benutzer Artikeldaten in und aus einer Datenbank einsehen und verändern können", websiteUrl: null, githubUrl: null },
                { title: "Project 5", description: "Beschreibung für Projekt 5. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse.", websiteUrl: null, githubUrl: null },
                { title: "Project 6", description: "Beschreibung für Projekt 6. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse.", websiteUrl: null, githubUrl: null },
                { title: "Project 7", description: "Beschreibung für Projekt 7. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse.", websiteUrl: null, githubUrl: null },
                { title: "Project 8", description: "Beschreibung für Projekt 8. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse.", websiteUrl: null, githubUrl: null },
                { title: "Project 9", description: "Beschreibung für Projekt 9. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse.", websiteUrl: null, githubUrl: null },
                { title: "Project 10", description: "Beschreibung für Projekt 10. Hier kannst du detaillierte Informationen über dieses Projekt hinzufügen, einschließlich der verwendeten Technologien, Herausforderungen und Ergebnisse.", websiteUrl: null, githubUrl: null }
            ];
        });
    
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
                        <button class="github">GITHUB</button>
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
            // Resume the slider animation by clearing inline styles
            slider.style.transition = '';
            slider.style.transform = '';
            slider.style.animation = 'autoRun 20s linear infinite';
            // Reset animation start time for accurate tracking
            animationStartTime = Date.now();
        }, 500);
    });

    // Event listener for see more button
    const seeMoreButton = infoSection.querySelector('.seeMore');
    seeMoreButton.addEventListener('click', function() {
        const currentIndex = parseInt(this.getAttribute('data-current-index'));
        if (currentIndex !== undefined && imageData[currentIndex] && imageData[currentIndex].websiteUrl) {
            window.open(imageData[currentIndex].websiteUrl, '_blank');
        } else {
            alert('Keine Website-URL verfügbar für dieses Projekt');
        }
    });

    // Event listener for GitHub button
    const githubButton = infoSection.querySelector('.github');
    githubButton.addEventListener('click', function() {
        const currentIndex = parseInt(this.getAttribute('data-current-index'));
        if (currentIndex !== undefined && imageData[currentIndex] && imageData[currentIndex].githubUrl) {
            window.open(imageData[currentIndex].githubUrl, '_blank');
        } else {
            alert('Keine GitHub-URL verfügbar für dieses Projekt');
        }
    });

    // Add click event for each image
    items.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Get the position of the clicked item
            const position = this.style.getPropertyValue('--position');

            // Get current rotation from computed transform before pausing animation
            const currentRotation = getCurrentRotation();
            
            // Pause the animation and set current transform to maintain position
            slider.style.animation = 'none';
            slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
            
            // Force a reflow to ensure the transform is applied
            slider.offsetHeight;

            // Calculate the rotation needed to bring the clicked item to front
            const itemCount = parseInt(slider.style.getPropertyValue('--quantity'));
            const targetRotation = -(parseInt(position) - 1) * (360 / itemCount);

            // Determine the shortest rotation path
            let rotationDiff = targetRotation - currentRotation;

            // Normalize rotation to -180 to 180 range to get shortest path
            while (rotationDiff > 180) rotationDiff -= 360;
            while (rotationDiff < -180) rotationDiff += 360;

            const finalRotation = currentRotation + rotationDiff;

            // Apply smooth rotation using CSS transition
            slider.style.transition = 'transform 1s ease-in-out';
            
            // Use setTimeout to ensure transition is applied after the current transform
            setTimeout(() => {
                slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${finalRotation}deg)`;
            }, 50);

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
                    const currentProject = imageData[index];
                    
                    infoSection.querySelector('.infoImage img').src = selectedImg;
                    infoSection.querySelector('.title').textContent = currentProject.title;
                    infoSection.querySelector('.des').textContent = currentProject.description;

                    // Set data attributes for button event handlers
                    const seeMoreBtn = infoSection.querySelector('.seeMore');
                    const githubBtn = infoSection.querySelector('.github');
                    
                    seeMoreBtn.setAttribute('data-current-index', index);
                    githubBtn.setAttribute('data-current-index', index);

                    // Show/hide buttons based on URL availability
                    if (currentProject.websiteUrl) {
                        seeMoreBtn.style.display = 'block';
                    } else {
                        seeMoreBtn.style.display = 'none';
                    }

                    if (currentProject.githubUrl) {
                        githubBtn.style.display = 'block';
                    } else {
                        githubBtn.style.display = 'none';
                    }

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

    // Function to get current rotation value based on animation timing
    function getCurrentRotation() {
        // Check if animation is running
        const computedStyle = window.getComputedStyle(slider);
        const animationPlayState = computedStyle.animationPlayState;
        
        if (animationPlayState === 'paused' || computedStyle.animation === 'none') {
            // If animation is paused, try to get rotation from current transform
            const transform = computedStyle.transform;
            if (transform && transform !== 'none') {
                // Try to extract rotation from transform
                const rotateYMatch = transform.match(/rotateY\(([^)]+)\)/);
                if (rotateYMatch) {
                    const value = rotateYMatch[1];
                    return parseFloat(value.replace('deg', ''));
                }
            }
            return 0;
        }
        
        // Animation is running - calculate based on elapsed time
        const currentTime = Date.now();
        const elapsedTime = (currentTime - animationStartTime) % 20000; // 20 second cycle
        const progress = elapsedTime / 20000; // 0 to 1
        const currentRotation = progress * 360; // 0 to 360 degrees
        
        return currentRotation;
    }
});