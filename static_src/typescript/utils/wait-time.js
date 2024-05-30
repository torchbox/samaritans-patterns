export const timeDisplay = (time) => {
    const displayValue = 'mins';

    if (time == null) {
        return `Awaiting time`;
    }
    time /= 60;
    if (time <= 5) {
        return `5 ${displayValue}`;
    }
    const baseTime = Math.ceil(time / 5) * 5;
    return `${baseTime - 5} - ${baseTime + 5} ${displayValue}`;
};
