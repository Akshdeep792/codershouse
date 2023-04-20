import React from 'react'
import {Navigate} from 'react-router-dom'
const isAuth = false
const GuestRoute = ({children}) => {

    if(isAuth){
        return <Navigate to='/rooms' />
    }else{
        return children
    }

  
}

export default GuestRoute