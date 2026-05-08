'use strict';
let __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
let __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const http_1 = __importDefault(require('http'));
const app_1 = __importDefault(require('./src/app'));
const db_1 = __importDefault(require('./src/config/db'));
const env_1 = require('./src/config/env');
const PORT = process.env.PORT || 4000;
const server = http_1.default.createServer(app_1.default);
const main = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield (0, db_1.default)();
      server.listen(PORT, () => {
        console.log(`Server is running at ${env_1.config.SERVER_URI}`);
      });
    } catch (error) {
      console.error('Failed to start the server due to a DB connection error', error);
      process.exit(1);
    }
  });
main();
