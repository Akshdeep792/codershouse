import React from 'react'
import { Navigate } from 'react-router-dom'
const SemiProtectedRoutes = ({ children }) => {
    const isAuth = false
    const user = {
        isActivated: false
    }

    if (!isAuth) {
        return <Navigate to="/" />

    }
    else {
        if (!user.isActivated) {
            return children
        }
        else {
            return <Navigate to="/rooms" />
        }
    }

}

export default SemiProtectedRoutes