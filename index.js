const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.send("This is start of Tambola Application!");
});


// if(process.env.NODE_ENV = "Production") {
//     app.use(express.static("client/build"));
// }

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});