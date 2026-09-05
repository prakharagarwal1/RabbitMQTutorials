const amqp = require("amqplib");

async function sendMail() {
  let connection;

  try {
    connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchange = "mail_exchange";
    const routingKey = "send_mail";
    const mailQueue = "mail_queue";

    const message = {
      to: "Hi@gmail.com",
      from: "harish@gmail.com",
      subject: "Hello TP mail",
      body: "Hello Rahul!!",
    };

    // Create exchange
    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    // Create durable queue
    await channel.assertQueue(mailQueue, {
      durable: true,
      exclusive: false,
      autoDelete: false,
    });

    // Bind queue to exchange
    await channel.bindQueue(mailQueue, exchange, routingKey);

    // Publish persistent message
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );

    const istTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "medium",
    });
    console.log("Mail data was sent at", istTime, ":", message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("RabbitMQ Error:", error);
  }
}

sendMail();
