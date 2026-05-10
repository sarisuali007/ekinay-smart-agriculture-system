const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const ALERT_QUEUE = process.env.ALERT_QUEUE || "ekinay.alert.notifications";

let connection = null;
let channel = null;

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createRabbitConnectionWithRetry() {
    let lastError = null;

    for (let attempt = 1; attempt <= 10; attempt++) {
        try {
            console.log(`RabbitMQ bağlantısı deneniyor... Deneme: ${attempt}`);

            connection = await amqp.connect(RABBITMQ_URL);

            connection.on("close", () => {
                console.log("RabbitMQ bağlantısı kapandı.");
                connection = null;
                channel = null;
            });

            connection.on("error", (error) => {
                console.error("RabbitMQ bağlantı hatası:", error.message);
            });

            console.log("RabbitMQ bağlantısı başarılı.");
            return connection;
        } catch (error) {
            lastError = error;
            console.log(`RabbitMQ hazır değil, tekrar denenecek: ${error.message}`);
            await wait(3000);
        }
    }

    throw lastError || new Error("RabbitMQ bağlantısı kurulamadı.");
}

async function getRabbitChannel() {
    if (channel) {
        return channel;
    }

    if (!connection) {
        connection = await createRabbitConnectionWithRetry();
    }

    channel = await connection.createChannel();

    await channel.assertQueue(ALERT_QUEUE, {
        durable: true
    });

    console.log("RabbitMQ kuyruğu hazır:", ALERT_QUEUE);

    return channel;
}

async function publishAlertMessage(message) {
    const rabbitChannel = await getRabbitChannel();

    const payload = Buffer.from(JSON.stringify(message));

    const published = rabbitChannel.sendToQueue(ALERT_QUEUE, payload, {
        persistent: true,
        contentType: "application/json"
    });

    return {
        queue: ALERT_QUEUE,
        published
    };
}

async function consumeAlertMessages(handler) {
    const rabbitChannel = await getRabbitChannel();

    await rabbitChannel.prefetch(1);

    await rabbitChannel.consume(ALERT_QUEUE, async (message) => {
        if (!message) return;

        try {
            const content = JSON.parse(message.content.toString());

            console.log("RabbitMQ mesajı alındı:", {
                title: content.title,
                fieldId: content.data?.fieldId,
                alertType: content.data?.alertType
            });

            await handler(content);

            rabbitChannel.ack(message);
            console.log("RabbitMQ mesajı başarıyla işlendi.");
        } catch (error) {
            console.error("RabbitMQ mesajı işlenemedi:", error.message);

            rabbitChannel.nack(message, false, false);
        }
    });

    console.log("RabbitMQ worker kuyruğu dinliyor:", ALERT_QUEUE);
}

module.exports = {
    publishAlertMessage,
    consumeAlertMessages
};