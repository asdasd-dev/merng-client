import React, { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { AuthContext } from "../context/auth";

export const AuthRoute: React.FC<RouteProps> = ({
    component: Component,
    ...restProps
}) => {
    const { user } = useContext(AuthContext);

    return (
        <Route
            {...restProps}
            render={(routeProps) => {
                return user ? <Redirect to="/" /> : <Component {...routeProps} />;
            }}
        ></Route>
    );
};
