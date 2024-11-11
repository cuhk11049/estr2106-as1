class Timer {
    private startTime: Date;

    constructor(private elementId: string) {
        this.startTime = new Date();
        this.updateTimer();
    }

    // Format the time to HH:MM:SS
    private formatTime(elapsedSeconds: number): string {
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    private updateTimer() {
        const timerElement = document.getElementById(this.elementId);
        if (timerElement) {
            const now = new Date();
            const elapsedSeconds = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
            timerElement.textContent = `Duration of stay: ${this.formatTime(elapsedSeconds)}`;
        }

        // Recursively call updateTimer every second
        setTimeout(() => this.updateTimer(), 1000);
    }
}

// Start the timer when the page is loaded
window.onload = () => {
    new Timer('timer');
};
