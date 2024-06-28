import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteEval = ({ element: Component }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5173/eval-api/dashboard', { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Component /> : <Navigate to="/eval/login" />;
};

export default PrivateRouteEval;
