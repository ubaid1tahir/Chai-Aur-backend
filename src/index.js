import app from "./app.js"
import connectionDb from "./db/index.js"
import dotenv from "dotenv"

dotenv.config({
    path: './env'
})

connectionDb()
.then(() => {
    app.on('error',(error) => {
        console.log("ERROR :( ", error)
    })
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Server is listening on http://localhost:${process.env.PORT}`);
    })
})
.catch(err => {
    console.log("Error in connecting to the database :( ")
    throw err;
})
