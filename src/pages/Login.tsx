import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext } from "react";
import {  useHistory } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import styled from "styled-components";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import { Mutation } from "../util/types";

const RegisterContainer = styled.div`
    width: 400px;
    margin: auto;
`;

export const Login: React.FC = () => {
    const context = useContext(AuthContext);

    const history = useHistory();

    const { onChange, onSubmit, values, errors, setErrors } = useForm(
        loginUserCallback,
        {
            username: "",
            password: "",
        }
    );

    const [loginUser, { loading }] = useMutation<Mutation>(LOGIN_USER, {
        update(_, { data: { login: userData } }) {
            history.push("/");
            context.login(userData);
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    function loginUserCallback() {
        loginUser();
    }

    return (
        <RegisterContainer>
            <Form
                onSubmit={onSubmit}
                noValidate
                className={loading ? "loading" : ""}
            >
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    type="text"
                    error={!!errors.username}
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    error={!!errors.password}
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={onChange}
                />
                <Button type="submit" primary floated="right">
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value: string) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </RegisterContainer>
    );
};

const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            email
            username
            createdAt
            token
        }
    }
`;
