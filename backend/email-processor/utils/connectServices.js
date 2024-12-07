import amqp from 'amqplib';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function connectRabbitMQ(retries = 5, interval = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            console.log('Connected to RabbitMQ');
            return connection;
        } catch (error) {
            console.log(`Failed to connect to RabbitMQ (attempt ${i + 1}/${retries})`);
            if (i === retries - 1) throw error;
            await wait(interval);
        }
    }
};
