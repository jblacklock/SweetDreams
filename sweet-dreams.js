    function extractVideoId(url) {
        const regExp = /^.*(?:youtu.be\/|v\/|embed\/|watch\?v=|watch\?.+&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[1].length == 11 ? match[1] : null;
    }

    function loadYouTubeVideo(url) {
        const videoId = extractVideoId(url);
        if (videoId) {
            const iframe = document.createElement('iframe');
            iframe.width = "560";
            iframe.height = "315";
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
            iframe.frameBorder = "0";
            iframe.allow = "autoplay; encrypted-media";
            iframe.id = "youtubeIframe";
            document.getElementById('videoContainer').innerHTML = '';
            document.getElementById('videoContainer').appendChild(iframe);
        }
    }

    function lowerVolume(intervalSeconds) {
        let volume = 100;
        const interval = setInterval(() => {
            if (volume > 0) {
                volume = Math.max(0, volume - 1);
                const iframe = document.getElementById('youtubeIframe');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"setVolume","args":[' + volume + ']}', '*');
                }
            } else {
                clearInterval(interval);
                const iframe = document.getElementById('youtubeIframe');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":[]}','*');
                }
            }
        }, intervalSeconds * 1000);
    }

    function calculateIntervalSeconds(targetTime) {
        const now = new Date();
        const [targetHours, targetMinutes] = targetTime.split(':').map(Number);
        
        const target = new Date(now);
        target.setHours(targetHours, targetMinutes, 0, 0);

        if (target < now) {
            target.setDate(target.getDate() + 1);
        }

        const diffInSeconds = (target - now) / 1000;
        return diffInSeconds / 100;
    }

    document.getElementById('watchBtn').addEventListener('click', () => {
        const url = document.getElementById('youtubeUrl').value;
        const timeInput = document.getElementById('timeInput').value;
        if (url) {
            loadYouTubeVideo(url);
            const intervalSeconds = calculateIntervalSeconds(timeInput);
            console.log("Here it is: "+intervalSeconds);
            lowerVolume(intervalSeconds);
        }
    });

    const youtubeInput = document.getElementById('youtubeUrl');

    const buttonConfigs = [
        { id: 'fiveMinBtn', volumeSteps: 3 },
        { id: 'tenMinBtn', volumeSteps: 6 },
        { id: 'fifteenMinBtn', volumeSteps: 9 },
        { id: 'twentyMinBtn', volumeSteps: 12 },
        { id: 'thirtyMinBtn', volumeSteps: 18 },
        { id: 'fortyFiveMinBtn', volumeSteps: 27 },
        { id: 'hourBtn', volumeSteps: 36 }
    ];

    function handleButtonClick(volumeSteps) {
        const url = youtubeInput.value;
        if (!url) return;

        loadYouTubeVideo(url);
        lowerVolume(volumeSteps);
    }

    buttonConfigs.forEach(({ id, volumeSteps }) => {
        document.getElementById(id).addEventListener('click', () => {
            handleButtonClick(volumeSteps);
        });
    });

    const blackoutButton = document.getElementById('blackoutButton');
    const blackoutOverlay = document.getElementById('blackoutOverlay');
    const exitButton = document.getElementById('exitButton');

    function enableBlackout() {
      blackoutOverlay.style.display = 'block';
    }

    function disableBlackout() {
      blackoutOverlay.style.display = 'none';
    }

    blackoutButton.addEventListener('click', enableBlackout);
    exitButton.addEventListener('click', disableBlackout);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        disableBlackout();
      }
    });

    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const explanation = toggle.nextElementSibling;

        if (explanation && explanation.classList.contains('explanation')) {
          explanation.classList.toggle('open');
        }
      });
    });