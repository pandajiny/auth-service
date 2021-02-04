import { app } from "./app";
import { API_PORT } from "./constants";

async function bootstrap() {
  app.listen(API_PORT, () => {
    console.log(`server is running on ${API_PORT}`);
  });
}

bootstrap();
