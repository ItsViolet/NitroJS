<div align="center">
  <img width="200px" src="https://raw.githubusercontent.com/SkylixGH/Info/main/logos/Logo%20Icon%20Auto.svg" alt="" />
</div>

<h1 align="center">N I T R O J S</h1>
<p align="center">A framework for every developer</p>

<div align="center">
  <a href="https://github.com/SkylixGH/NitroJS" target="_blank">NitroJS</a> •
  <a href="https://discord.gg/b9vcR6evgG" target="_blank">Discord</a>
</div>

<br />
<br />

#### Why you should build your projects with **NitroJS**
-   **Blazing fast**: NitroJS uses its own caching system that was inspired by NextJS's `.next` cache directory. 
-   **Easy to use**: NitroJS is very easy to use due to us providing most of the module needed to write an entire application, we do our best to keep the framework API as easy as possible to use!
-   **Use it everywhere**: NitroJS is a full-stack framework, thus, we provide modules for building the server application, plus, support for all client platforms such as desktop, mobile and the web, all with JavaScript/TypeScript!

#### Create a new app!
##### Step 1
Install the CLI to your system via the following command:
```
npm install -g @skylixgh/nitrojs@next
```

##### Step 2
CD into your projects folder and run the following command, and **YOU MUST select NodeJS as the app type as only that is supported**, after this, cd into the newly created directory:
```
npx nitrojs init
```

##### Step 3
**This is for now, but we will do a bug fix on this**: Create a `nitrojs.config.ts` file and put the following contents:
```ts
import { AppConfigType, typeConfig } from "@skylixgh/nitrojs-cli";

export default typeConfig({
    type: AppConfigType.node
});
```

After that run the following command after you:
```
npm install
```

##### Step 4
Now lets run your app:
```
npx nitrojs dev
```

**And thats it, you made your first NitroJS app!**
> Edit the files to see your changes apply in real-time!
