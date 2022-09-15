import mysql, { Connection } from "mysql";
import config from "../../config";

var _connection: Connection[] = [];
var _connectionId: number = 0;
var _maxConnection: number = parseInt(process.env.CONNECTION_COUNT || "1");

export default {
  connectToServer: function (callback: () => void) {
    for (let i = 0; i < _maxConnection; i++) {
      _connection[i] = mysql.createConnection(config.db);
      _connection[i].connect();
    }
    return callback();
  },

  getConnection: function () {
    _connectionId = (_connectionId + 1) % _maxConnection;
    return _connection[_connectionId];
  },
};
