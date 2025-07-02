import amqp, { ChannelModel, Channel} from "amqplib";

// Singleton for connection and channel
let connection: ChannelModel | null = null;
let channel: Channel | null = null;

async function getRabbitMQChannel() {
    if (channel && connection) {
        return { channel, connection };
    }

    try {
        connection = await amqp.connect("amqp://localhost:5672");
        
       
        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err);
            channel = null;
            connection = null;
        });

        connection.on("close", () => {
            console.log("RabbitMQ connection closed");
            channel = null;
            connection = null;
        });

        channel = await connection.createChannel();
        return { channel, connection };
    } catch (e) {
        console.error("Error connecting to RabbitMQ:", e);
        channel = null;
        connection = null;
        throw e;
    }
}

interface Task {
    id: string;
    url: string;
}

export async function pushManyToQueue(queue_name: string, items: Task[]) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        
        for (const item of items) {
            const success = channel.sendToQueue(
                queue_name, 
                Buffer.from(JSON.stringify(item)), 
                { persistent: true }
            );
            
            if (!success) {
                console.log("Failed to enqueue:", item);
            }
        }
    } catch (e) {
        console.error("Error in pushManyToQueue:", e);
        throw e;
    }
}

export async function pushToQueue(queue_name: string, item: Task) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        const success = channel.sendToQueue(
            queue_name, 
            Buffer.from(JSON.stringify(item)), 
            { persistent: true }
        );
        
        if (!success) {
            console.log("Failed to enqueue:", item);
        }
    } catch (e) {
        console.error("Error in pushToQueue:", e);
        throw e;
    }
}

 export async function consumeFromQueueForAlerts(queue_name:string, sendEmailAlert: (url: string, id: string) => Promise<boolean>) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        channel.prefetch(100);
        
        channel.consume(queue_name, async (msg) => {
            if (!msg) return;
            
            const task = JSON.parse(msg.content.toString());
            try {
                const success = await sendEmailAlert(task.url, task.id);
                if (success) {
                    channel.ack(msg);
                    console.log("Processed and acked:", task);
                } else {
                    channel.nack(msg, false, false);
                    console.log("Processing failed:", task);
                }
            } catch (e) {
                channel.nack(msg, false, false);
                console.error("Error processing message:", e);
            }
        }, { noAck: false });
    } catch (e) {
        console.error("Error in consumeFromQueueForAlerts:", e);
        throw e;
    }
}
export async function consumeFromQueue(queue_name: string, poller: (url: string, id: string) => Promise<boolean>) {
    try {
        const { channel } = await getRabbitMQChannel();
        await channel.assertQueue(queue_name, { durable: true });
        channel.prefetch(100);
        
        channel.consume(queue_name, async (msg) => {
            if (!msg) return;
            
            const task = JSON.parse(msg.content.toString());
            try {
                const success = await poller(task.url, task.id);
                if (success) {
                    channel.ack(msg);
                    console.log("Processed and acked:", task);
                } else {
                    channel.nack(msg, false, false);
                    console.log("Processing failed:", task);
                }
            } catch (e) {
                channel.nack(msg, false, false);
                console.error("Error processing message:", e);
            }
        }, { noAck: false });
    } catch (e) {
        console.error("Error in consumeFromQueue:", e);
        throw e;
    }
}

process.on('SIGINT', async () => {
    if (channel) {
        await channel.close();
        channel = null;
    }
    if (connection) {
        await connection.close();
        connection = null;
    }
    process.exit(0);
});
