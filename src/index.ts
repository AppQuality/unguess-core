import app from "@src/app";
import config from "@src/config";
import connectionManager from "@src/features/db/mysql";
const PORT = config.port || 3000;

connectionManager.connectToServer(() => {
  app.listen(PORT, () => console.info("api listening on port " + PORT));
});
