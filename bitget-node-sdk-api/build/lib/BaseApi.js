"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApi = void 0;
const util_1 = __importStar(require("./util"));
const config_1 = require("./config");
const axios_1 = __importDefault(require("axios"));
const Console = __importStar(require("console"));
class BaseApi {
    constructor(apiKey, secretKey, passphrase, locale, httpConfig = { timeout: 10000 }) {
        this.axiosInstance = axios_1.default.create({
            baseURL: config_1.API_CONFIG.API_URL,
            ...httpConfig
        });
        this.axiosInstance.interceptors.request.use((data) => {
            if (data.data) {
                data.data = util_1.toJsonString(data.data);
            }
            Console.log('request:', data.data || data.params);
            return data;
        });
        this.axiosInstance.interceptors.response.use((data) => {
            return data.data;
        }, (err) => {
            // Console.error(err.response.data)
            // throw err.response.data
            return err.response.data;
        });
        this.signer = util_1.default(apiKey, secretKey, passphrase, locale);
    }
}
exports.BaseApi = BaseApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvQmFzZUFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQWdFO0FBQ2hFLHFDQUFvQztBQUNwQyxrREFBK0Q7QUFDL0QsaURBQW1DO0FBRW5DLE1BQWEsT0FBTztJQVNoQixZQUNJLE1BQWMsRUFDZCxTQUFpQixFQUNqQixVQUFrQixFQUNsQixNQUFlLEVBQ2YsYUFBaUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDO1FBRWpELElBQUksQ0FBQyxhQUFhLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQztZQUM5QixPQUFPLEVBQUUsbUJBQVUsQ0FBQyxPQUFPO1lBQzNCLEdBQUcsVUFBVTtTQUNoQixDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDakQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsbUJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdkM7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNqRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ3hDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckIsQ0FBQyxFQUNELENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDSixtQ0FBbUM7WUFDbkMsMEJBQTBCO1lBQzFCLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDN0IsQ0FBQyxDQUNKLENBQUE7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLGNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUNsRSxDQUFDO0NBR0o7QUExQ0QsMEJBMENDIn0=