
import React, { useEffect, useState } from 'react';
import { RequestHandler } from '../clients/';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const DataTable = () => {
    const [socketUrl, setSocketUrl] = useState('wss://prototype.sbulltech.com/api/ws');
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, 
        {
            shouldReconnect: (closeEvent) => true,
            reconnectAttempts: 10,
            reconnectInterval: 3000,
          });
    const [ status, setStatus] = useState(false);
    const [ underlyingsData, setUnderlyingsData] = useState([]);

    const getUnderlyingsData = async (url='/underlyings') => {
        
  
        const res = await RequestHandler(url, {});
        const getTokensList = getTokens(res.data.payload);
        getSubscribe(getTokensList, true)
        setUnderlyingsData(res.data.payload)
        
    }

    const getSubscribe = (tokenData, isSubscribe) => {
        let req = {
            "msg_command":`${isSubscribe ? "subscribe" : "unsubscribe"}`,
            "data_type":"quote",
            "tokens":tokenData
           }
           console.log('req', req)
        sendMessage(JSON.stringify(req));
    }

    const getTokens = (tokens) => {
        return tokens && tokens.reduce((acc, item) => {
           return [...acc, item.token];
        }, []);
    }

    const getDirectiveData = (token) => {
        const url = `/derivatives/${token}`
        setStatus(true);
        getUnderlyingsData(url)
    }
    const onBack = () => {
        const url = `/underlyings`
        setStatus(false);
        getUnderlyingsData(url)
    }
    useEffect(() => {
        const url = `/underlyings`
        getUnderlyingsData(url);
        return () => {
            if(underlyingsData) {
                const getTokensList = getTokens(underlyingsData);
                getSubscribe(getTokensList, false)
            }
        }
    }, [])


    useEffect(() => {
        let modiFied = underlyingsData;
        if (lastMessage !== null) {
            let payload = JSON.parse(lastMessage.data).payload;
          modiFied.forEach((item) => {
            
            if(payload.token === item.token) {
                let newPrice = payload.price ? payload.price.toFixed(2) : item.price ? item.price : '';
                let status = item.price < newPrice ? 'up' : (item.price > newPrice ? 'down' : 'nochange');
                item.price = newPrice;
                item.status = status;
            }
          })
          
          setUnderlyingsData(modiFied)
        }
      }, [lastMessage, setUnderlyingsData]);

    return (
        <div>
            
            <div><h1>{status ? 'Directive' : 'Underlyings'}</h1>
            {status && <button className='back' onClick={() => onBack(false)}>{`< Back `}</button>}
            <ul className='listbox' role='listbox'>
                {underlyingsData && underlyingsData.length > 0 && underlyingsData.map((item) => (
                    <li key={item.token} role="listitem" className='listitem'>
                        <h3>{item.underlying}</h3>
                        <span className={`${item.status}`}>{item.price}</span>
                        <div>
                            {!status && <button onClick={() => getDirectiveData(item.token)}>{`Show directive > `}</button>}
                        </div>
                    </li>
                ))}
            </ul>
            </div>
        </div>
    )
}

export default DataTable;