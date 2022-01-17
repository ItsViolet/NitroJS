import terminal from "@skylixgh/nitrojs-terminal";
import path from "path";
import configTools,{Errors as ConfigErrors} from "@skylixgh/nitrojs-config-tools";


terminal.setDebugLocation(path.join(__dirname, "../debug"))
terminal.setDebuggerEnabled(true)
terminal.success("code catos are looking for bugs")
terminal.notice("The koren catos are watching", true)

configTools.read(path.join(__dirname, "../slav.ts"),{
    CreatedAt:"2020"
}).then((config) => {
    console.log(config)
}).catch((err) => {
    console.log(err,ConfigErrors)
})