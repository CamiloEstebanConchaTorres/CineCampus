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
        this.#url = this.#constructUri();
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
        this.db = this.conexion.db(process.env.MONGO_DB);
    }

    #constructUri() {
        const user = encodeURIComponent(process.env.MONGO_USER);
        const pass = encodeURIComponent(process.env.MONGO_PASS);
        const host = process.env.MONGO_HOST;
        const port = process.env.MONGO_PORT;
        const dbName = process.env.MONGO_DB;
        const replicaSet = process.env.MONGO_REPLICA_SET;
        const ssl = process.env.MONGO_SSL === 'true' ? 'true' : 'false';
        const authSource = process.env.MONGO_AUTH_SOURCE;

        return `mongodb://${user}:${pass}@${host}:${port}/${dbName}?replicaSet=${replicaSet}&ssl=${ssl}&authSource=${authSource}`;
    }
}
