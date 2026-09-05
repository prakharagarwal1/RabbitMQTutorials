const amqp = require("amqplib");

async function recvMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "mail_queue";
    await channel.assertQueue(queue, {
      durable: true,
      exclusive: false,
      autoDelete: false,
      arguments: {},
    });

    channel.consume(queue, (message) => {
      if (message !== null) {
        const istTime = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "medium",
        });
        console.log("Recv message at", istTime, JSON.parse(message.content));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

recvMail();
