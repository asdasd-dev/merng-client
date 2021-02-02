import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext, useState } from "react";
import { RouterProps, useHistory } from "react-router-dom";
import { Button, Form, FormInputProps } from "semantic-ui-react";
import styled from "styled-components";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import { Mutation } from "../util/types";

const RegisterContainer = styled.div`
    width: 400px;
    margin: auto;
`;

export const Register: React.FC = (props) => {
    const context = useContext(AuthContext);

    const history = useHistory();

    const intitalState = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const { onChange, onSubmit, values, errors, setErrors } = useForm(
        registerUser,
        intitalState
    );

    const [addUser, { loading }] = useMutation<Mutation>(REGISTER_USER, {
        update(_, { data: { register: userData } }) {
            context.login(userData);
            history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values,
    });

    function registerUser() {
        addUser();
    }

    return (
        <RegisterContainer>
            <Form
                onSubmit={onSubmit}
                noValidate
                className={loading ? "loading" : ""}
            >
                <h1>Register</h1>
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
                    label="Email"
                    placeholder="Email..."
                    error={!!errors.email}
                    name="email"
                    type="email"
                    value={values.email}
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
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password..."
                    type="password"
                    error={!!errors.confirmPassword}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={onChange}
                />
                <Button type="submit" primary floated="right">
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`;
