import React, {useContext} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthContext} from '../context/Context.js'
import {privateRoutes, publicRoutes} from './Routes.js'

const AppRouter = () => {
    const {isAuth} = useContext(AuthContext)
    return (
        <React.Fragment>
            {isAuth
                ?
                <Switch>
                    {privateRoutes.map(route =>
                        <Route
                            component={route.component}
                            path={route.path}
                            exact={route.exact}
                            key={route.path}
                        />
                    )};
                    <Redirect to="/home"/>
                </Switch>
                :
                <Switch>
                    {publicRoutes.map(route =>
                        <Route
                            component={route.component}
                            path={route.path}
                            exact={route.exact}
                            key={route.path}
                        />
                    )};
                    <Redirect to="/login"/>
                </Switch>
            }
        </React.Fragment>
    )
};

export default AppRouter

