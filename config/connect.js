const { MongoClient } = require('mongodb');
require('dotenv').config();

function extractUsernameFromUri(uri) {
    const match = uri.match(/mongodb:\/\/([^:]+):/);
    return match ? match[1] : null;
}

module.exports = class Connect {
    static instanceConnect;
    db;
    #url;

    constructor() {
        if (Connect.instanceConnect) {
            return Connect.instanceConnect;
        }
        
        this.#url = process.env.MONGO_URI;
        
        const uriUser = extractUsernameFromUri(this.#url);
        const envUser = process.env.MONGO_USER;

        if (uriUser !== envUser) {
            throw new Error(`User mismatch: URI user '${uriUser}' does not match ENV user '${envUser}'`);
        }
        
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
