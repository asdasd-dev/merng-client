import { decode } from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import React, { createContext, useReducer } from "react";
import { Mutation, MutationLoginArgs, User } from "../util/types";

interface TokenData {
    exp: number;
}

const initialState: AuthContextType = { user: null };

if (localStorage.getItem("jwtToken")) {
    const decodedToken = jwtDecode<User & TokenData>(localStorage.getItem("jwtToken"));

    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("jwtToken");
    } else {
        initialState.user = decodedToken as User;
    }
}

interface AuthContextType {
    user: User;
    login?: (user: User) => void;
    logout?: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
});

function authReducer(
    state: AuthContextType,
    action: { type: string; payload?: User }
) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
            };

        case "LOGOUT":
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
}

export function AuthProvider(props: any) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData: User) {
        localStorage.setItem("jwtToken", userData.token);
        dispatch({
            type: "LOGIN",
            payload: userData,
        });
    }

    function logout() {
        localStorage.removeItem("jwtToken");
        dispatch({ type: "LOGOUT" });
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    );
}
