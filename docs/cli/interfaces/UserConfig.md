# Interface `UserConfig`

Your application's configuration type.

-   `type` : [`ConfigAppType`](../enums/ConfigAppType.md) **[Required]** The type of application you have.
-   `node` : `object` **[Required]** Settings for a NodeJS app.
    -   `autoRestart` : `boolean` **[Required]** If your app should restart when 1 or more files are saved.
