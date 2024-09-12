import React, { useEffect, useState } from 'react'

const useDebounce = (value, delay) => {

    const[debouncedVal, SetDebouncedVal] = useState();

    useEffect(()=>{
        const timer = setTimeout(()=>{
            SetDebouncedVal(value)

        },delay  );

        return ()=>{
            clearTimeout(timer);
        }


    
    },[value,delay]);

    return debouncedVal;

}

export default useDebounce;
