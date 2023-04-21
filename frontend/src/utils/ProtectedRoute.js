import React from 'react'
import { Navigate } from 'react-router-dom'
const ProtectedRoute = ({ children }) => {
    const isAuth = false
    const user = {
        isActivated: false
    }

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