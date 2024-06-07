import express from "express";
const port = process.env.PORT || 3000;
import { Queue, Worker } from "bullmq";
export const redisOptions = { host: "redis", port: 6379 };
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const myQueue = new Queue("sendEmail", { connection: redisOptions });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.get("/", async (req, res) => {
  res.json(`Get successfully`);
});

app.post("/sendEmail", async (req, res) => {
  myQueue.add("email", { email: req.body.email, text: req.body.text });

  res.json("O email foi adicionado a fila");
});

const worker = new Worker(
  "sendEmail",
  async (job) => {
    console.log("executando job");

    return sendEmail(job.data.email, job.data.text);
  },
  { connection: redisOptions }
);

worker.on("completed", (job, returnvalue) => {
  console.log("Email enviado");
});

const sendEmail = async (email, text) => {
  // send email
  return true;
};
