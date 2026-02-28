import express from "express";
import contactRoutes from "./routes/contact.routes";

const app = express();

app.use(express.json());

app.use("/", contactRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    message: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});