const express = require ('express');
const Asiento = require('./js/module/asiento');
const app = express();




app.use(express.static(process.env.EXPRESS_STATIC))
app.get("/", function (req, res){
    res.sendFile(`${process.env.EXPRESS_STATIC}/index.html`, {root: __dirname})
})


app.get("/asiento",async (req,res)=>{
    let obj = new Asiento();
    res.status(200).send(await obj.getAllAsientos());
})

app.get("/asiento/:_id",async (req,res)=>{
    let obj = new Asiento();
    res.status(200).send(await obj.getOneAsiento(req.params));
})

app.listen({
    host: process.env.EXPRESS_HOST, 
    port: parseInt(process.env.EXPRESS_PORT)
}, () => {
    console.log(`Servidor corriendo en: http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});