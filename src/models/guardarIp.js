const fs = require("fs");
const path = require("path");
const  { v4 : uuidv4 } =require("uuid")

const listarIp = () => {
    const dataFile = fs.readFileSync(path.join(__dirname,'./ip.json'),{encoding: 'utf8'});
    const dataJson = JSON.parse(dataFile)
    return dataJson

};

const buscarIp = (ip) => {
    const result = listarIp()
    return result.find(item => item.ip === ip)
};

const guardarIp = (ip, nombre) => {
    const lista =listarIp()
    lista.push({id:uuidv4(),ip,nombre})
    fs.writeFileSync(path.join(__dirname,'./ip.json'),JSON.stringify(lista,null,4),{encoding: 'utf8'})
};

const eliminarIp = () => {};

const editarIp = () => {};



module.exports = { buscarIp, editarIp, guardarIp, eliminarIp };
