import { URLS } from "./constants.js";
import { resolveUrls } from "./dns.js";
import { updateFiles } from "./generator.js";

const main = async () => {
  console.log(`[Info] Starting DNS resolution for ${URLS.length} domains...`);
  
  const start = Date.now();
  const configs = await resolveUrls(URLS);
  const duration = ((Date.now() - start) / 1000).toFixed(2);
  
  const successCount = configs.filter(c => c.ip).length;
  console.log(`[Info] Resolved ${successCount}/${configs.length} domains in ${duration}s.`);

  await updateFiles(configs);
};

main().catch(err => {
  console.error("[Fatal]", err);
  process.exit(1);
});
