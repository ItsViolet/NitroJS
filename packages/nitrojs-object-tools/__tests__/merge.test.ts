import { mergeObject } from "..";

console.log(
    mergeObject(
        {
            name: "Gamer boi",
            guy: true,
            meta: {
                age: 14,
                bod: "Sept 13 2007"
            }
        },
        {
            guy: false,
            meta: {}
        }
    )
);
