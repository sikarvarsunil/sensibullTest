import axios from 'axios';
import constant from '../constant'


export const RequestHandler = async (url, config) => {
    let modifiedConfig = config;
    modifiedConfig.url = `${constant.baseUrl}${url}`
    modifiedConfig.method = config && config.method ? config.method : 'get';
    try {
        return await axios(modifiedConfig);
    } catch(err) {
        return console.log(err);
    }
}