
import amqp from "amqplib";
async function connectToRabbit() {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        return {  channel,connection };
    } catch (e) {
        console.log("Error connecting Rabbit", e);
        throw e
    }
}

export async function pushManyToQueue(queue_name: string, items: JSON[]) {
    const { channel, connection } = await connectToRabbit();
    await channel.assertQueue(queue_name, { durable: true });

    for (const item of items) {
        const success = channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(item)), {
            persistent: true,
        });
        if (!success) {
            console.log("Failed to enqueue:", item);
        }
    }

    await channel.close();
    await connection.close();
}

export async function consumeFromQueue(queue_name: string, poller: (item: string) => Promise<boolean>) {
    const { channel, connection } = await connectToRabbit();
    await channel.assertQueue(queue_name, { durable: true });
    channel.prefetch(10); 
    channel.consume(queue_name, async (msg) => {
        if (msg) {
            const content = msg.content.toString();
            try {
                const success = await poller(content);
                if (success) {
                    channel.ack(msg);
                    console.log("Processed and acked:", content);
                } else {
                    channel.nack(msg, false, true); 
                    console.log(" Processing failed:", content);
                }
            } catch (e) {
                channel.nack(msg, false, true);
                console.log(" Error processing message:", e);
            }
        }
    }, { noAck: false });
}
