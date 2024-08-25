const { MongoClient } = require('mongodb');
require('dotenv').config();

module.exports = class Connect {
    static instanceConnect;
    db;
    #url;

    constructor() {
        if (Connect.instanceConnect) {
            return Connect.instanceConnect;
        }
        this.#url = process.env.MONGO_URI; // Usa la nueva variable de entorno
        this.#open();
        Connect.instanceConnect = this;
    }

    destructor() {
        Connect.instanceConnect = undefined;
    }

    async reConnect() {
        await this.#open();
    }

    async #open() {
        this.conexion = new MongoClient(this.#url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await this.conexion.connect();
        this.db = this.conexion.db();
    }
}
