import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
const ProtectedRoute = ({ children }) => {
    const { user, isAuth } = useSelector((state) => state.auth)

    // const user = {
    //     isActivated: false
    // }

    if (!isAuth) {
        return <Navigate to="/" />

    }
    else {
        if (!user.isActivated) {
            return <Navigate to="/activate" />
        }
        else {
            return children
        }
    }
}

export default ProtectedRoute