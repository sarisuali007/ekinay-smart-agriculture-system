async function sendExpoPush(expoPushToken, payload) {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            to: expoPushToken,
            sound: "default",
            title: payload.title,
            body: payload.body,
            data: payload.data
        })
    });

    return await response.json();
}

module.exports = {
    sendExpoPush
};