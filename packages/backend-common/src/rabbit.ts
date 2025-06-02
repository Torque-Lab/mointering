
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
interface Task {
    id: string;
    url: string;
  }
export async function pushManyToQueue(queue_name: string, items:Task[]) {
    const { channel, connection } = await connectToRabbit();
    await channel.assertQueue(queue_name, { durable: true });
    for (let i=0;i<items.length;i++) {
        const item=items[i]
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

export async function consumeFromQueue(queue_name: string, poller: (url: string,id:string) => Promise<boolean>) {
    const { channel, connection } = await connectToRabbit();
    await channel.assertQueue(queue_name, { durable: true });
    channel.prefetch(100); 
    channel.consume(queue_name, async (msg) => {
        if (msg) {
            const task=JSON.parse(msg.content.toString())
            try {
                const success = await poller(task.url,task.id);
                if (success) {
                    channel.ack(msg);
                    console.log("Processed and acked:", task);
                } else {
                    channel.nack(msg, false, false); 
                    console.log(" Processing failed:", task);
                }
            } catch (e) {
                channel.nack(msg, false, false);
                console.log(" Error processing message:", e);
            }
        }
    }, { noAck: false });
}
