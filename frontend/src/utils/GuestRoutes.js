import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// const isAuth = false

const GuestRoute = ({ children }) => {
    const { isAuth } = useSelector((state) => state.auth)
    if (isAuth) {
        return <Navigate to='/rooms' />
    } else {
        return children
    }


}

export default GuestRoute