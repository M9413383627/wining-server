$(document).ready(function() {
    // Function to get current date in YYYYMMDD format
    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    // Function to calculate period counter (0-480) based on time
    function getPeriodCounter() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(0, 0, 0, 0);
        const diffMs = now - midnight;
        const diffMin = Math.floor(diffMs / 60000); // Convert to minutes
        let counter = Math.floor(diffMin / 3); // 3-minute intervals
        if (counter > 480) counter = 0; // Reset if exceeds 480
        return String(counter).padStart(3, '0');
    }

    // Function to update period
    function updatePeriod() {
        const date = getCurrentDate();
        const counter = getPeriodCounter();
        $('#period').text(`${date}${counter}`);
    }

    // Initial period update
    updatePeriod();

    // 3-minute countdown
    let time = 180; // 3 minutes in seconds
    function startCountdown() {
        const countdown = setInterval(() => {
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            $('#countdown').text(`${minutes}:${seconds}`);
            if (--time < 0) {
                clearInterval(countdown);
                // Increment period counter
                let currentPeriod = $('#period').text();
                let counter = parseInt(currentPeriod.slice(-3)) + 1;
                if (counter > 480) {
                    // Reset to 000 if counter exceeds 480
                    const newDate = getCurrentDate();
                    counter = '000';
                    $('#period').text(`${newDate}${counter}`);
                } else {
                    $('#period').text(currentPeriod.slice(0, -3) + String(counter).padStart(3, '0'));
                }
                time = 180; // Reset countdown to 3 minutes
                startCountdown(); // Restart countdown
            }
        }, 1000);
    }

    // Start the countdown
    startCountdown();
});