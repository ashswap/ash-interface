type DurationFormat = "DAYS" | "HOURS" | "MINUTES" | "SECONDS";

export function formatDuration(
    duration: number,
    format: DurationFormat = "SECONDS"
): string {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    switch (format) {
        case "DAYS":
            days = Math.floor(duration / 86400);
            hours = Math.floor((duration % 86400) / 3600);
            minutes = Math.floor((duration % 3600) / 60);
            seconds = duration % 60;
            break;
        case "HOURS":
            hours = Math.floor(duration / 3600);
            minutes = Math.floor((duration % 3600) / 60);
            seconds = duration % 60;
            break;
        case "MINUTES":
            minutes = Math.floor(duration / 60);
            seconds = duration % 60;
            break;
        case "SECONDS":
            seconds = duration;
            break;
        default:
            throw new Error("Invalid duration format");
    }

    let formattedDuration = "";

    if (days > 0) {
        formattedDuration += `${days} day${days > 1 ? "s" : ""} `;
    }

    if (hours > 0) {
        formattedDuration += `${hours} hour${hours > 1 ? "s" : ""} `;
    }

    if (minutes > 0) {
        formattedDuration += `${minutes} minute${minutes > 1 ? "s" : ""} `;
    }

    if (seconds > 0) {
        formattedDuration += `${seconds} second${seconds > 1 ? "s" : ""}`;
    }

    return formattedDuration.trim();
}
