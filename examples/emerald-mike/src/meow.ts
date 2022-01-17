import terminal from "@skylixgh/nitrojs-terminal";

aa();
function aa(){
    terminal.askYN("do you want a meow?", true, (ans) => {
        if (ans){
            terminal.log("meow");
        }else{
            terminal.warning("Koren catos are sending nukes! unless you except the meow!")
            aa();
        }
    });  
}
 