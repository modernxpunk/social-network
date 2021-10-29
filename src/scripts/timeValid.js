export const isSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()

export function toMMDD(date) {
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${month}.${day}`;
}

export function toHHMM(date) {
    const sec_num = parseInt(date, 10)
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60)

    if (hours < 10) hours = "0" + hours
    if (minutes < 10) minutes = "0" + minutes

    return `${hours}:${minutes}`;
}

export function timeValidation(dateString) {
    const dateOfMessage = new Date(dateString)
    const currentMessage = new Date()
    if (!isSameDay(dateOfMessage, currentMessage)) {
        return toHHMM(dateOfMessage)
    } else {
        return toMMDD(dateOfMessage)
    }
}
