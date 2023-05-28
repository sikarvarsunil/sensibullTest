
import React, { useEffect, useState } from 'react';
import { RequestHandler } from '../clients/';

const DataTable = () => {
    const [ status, setStatus] = useState(false);
    const [ underlyingsData, setUnderlyingsData] = useState([]);

    const getUnderlyingsData = async (url='/underlyings') => {
        
        const res = await RequestHandler(url, {});
            setUnderlyingsData(res.data.payload)
        
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
    }, [])


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