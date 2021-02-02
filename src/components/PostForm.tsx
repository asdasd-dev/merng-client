import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Button, Form } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { useForm } from "../util/hooks";
import { Query } from "../util/types";

export const PostForm: React.FC = () => {
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: "",
    });
    const [createPost, { error }] = useMutation(CREATE_POST, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery<Query>({
                query: FETCH_POSTS_QUERY,
            });
            const newData = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: { ...data, getPosts: { newData } },
            });
            values.body = "";
        },
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi world!"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={!!error}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    );
};

const CREATE_POST = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`;
