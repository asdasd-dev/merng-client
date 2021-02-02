import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import React, { useContext, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import {
    Button,
    Card,
    Form,
    Grid,
    Icon,
    Image,
    Label,
    Transition,
} from "semantic-ui-react";
import { DeleteButton } from "../components/DeleteButton";
import { LikeButton } from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import { MyPopup } from "../util/MyPopup";
import { Post, QueryGetPostArgs } from "../util/types";

export const SinglePost: React.FC<RouteComponentProps<{ postId: string }>> = (
    props
) => {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);

    const [comment, setComment] = useState("");

    const { data } = useQuery<{ getPost: Post }>(FETCH_POST_QUERY, {
        variables: {
            postId,
        },
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT, {
        update(_, result) {
            setComment("");
        },
        variables: {
            postId,
            body: comment,
        },
    });

    function deletePostCallback() {
        props.history.push("/");
    }

    let postMarkup;

    if (!data) {
        postMarkup = <p>Loading post...</p>;
    } else {
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount,
        } = data.getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton
                                    user={user}
                                    post={{ id, likes, likeCount }}
                                />
                                <MyPopup
                                    content="Comment on post"
                                    trigger={
                                        <Button
                                            as="div"
                                            labelPosition="right"
                                            onClick={() =>
                                                console.log("Comment on post")
                                            }
                                        >
                                            <Button basic color="blue">
                                                <Icon name="comments" />
                                            </Button>
                                            <Label
                                                basic
                                                color="blue"
                                                pointing="left"
                                            >
                                                {commentCount}
                                            </Label>
                                        </Button>
                                    }
                                />
                                {user && user.username === username && (
                                    <DeleteButton
                                        postId={id}
                                        callback={deletePostCallback}
                                    />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                            />
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ""}
                                                onClick={() => submitComment()}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        <Transition.Group>
                            {comments.map((comment) => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {user &&
                                            user.username ===
                                                comment.username && (
                                                <DeleteButton
                                                    postId={id}
                                                    commentId={comment.id}
                                                />
                                            )}
                                        <Card.Header>
                                            {comment.username}
                                        </Card.Header>
                                        <Card.Meta>
                                            {moment(
                                                comment.createdAt
                                            ).fromNow()}
                                        </Card.Meta>
                                        <Card.Description>
                                            {comment.body}
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Transition.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    return postMarkup;
};

const SUBMIT_COMMENT = gql`
    mutation($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`;

const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
            id
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`;
