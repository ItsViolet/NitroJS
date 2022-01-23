import ConfigTools from "../../src/ConfigTools";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ConfigTools.read(path.join(process.cwd(), "./test.config")).then((config) => {
    console.log(config);
}).catch((error) => {
    console.log(error.name);
    console.log(error.message);
})
