import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { MyPopup } from "../util/MyPopup";
import { Post } from "../util/types";

export const DeleteButton: React.FC<{
    postId: string;
    callback?: () => void;
    commentId?: string;
}> = ({ postId, callback, commentId }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy, result) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery<{ getPosts: Post[] }>({
                    query: FETCH_POSTS_QUERY,
                });
                const newData = {
                    getPosts: data.getPosts.filter((p) => p.id !== postId),
                };
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
            }
            callback && callback();
        },
        variables: {
            postId,
            commentId,
        },
    });

    return (
        <>
            <MyPopup
                content={commentId ? "Delete Comment" : "Delete Post"}
                trigger={
                    <Button
                        as="div"
                        color="red"
                        floated="right"
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Icon name="trash" style={{ margin: 0 }} />
                    </Button>
                }
            />
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => deletePostOrComment()}
            />
        </>
    );
};

const DELETE_POST = gql`
    mutation($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

const DELETE_COMMENT = gql`
    mutation($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`;
