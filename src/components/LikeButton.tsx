import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import { MyPopup } from "../util/MyPopup";
import { Like, User } from "../util/types";

export const LikeButton: React.FC<{
    user: User;
    post: { id: string; likeCount: number; likes: Like[] };
}> = ({ user, post: { id, likeCount, likes } }) => {
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        console.log(
            user && likes.find((like) => like.username === user.username)
        );
        if (user && likes.find((like) => like.username === user.username)) {
            console.log("setting liked as true");
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [user, likes]);

    console.log(liked);

    const [likePost] = useMutation(LIKE_POST, {
        variables: {
            postId: id,
        },
    });

    const likeButton = user ? (
        liked ? (
            <Button color="teal">
                <Icon name="heart" />
            </Button>
        ) : (
            <Button color="teal" basic>
                <Icon name="heart" />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color="teal" basic>
            <Icon name="heart" />
        </Button>
    );

    return (
        <MyPopup
            content={liked ? "Unlike Post" : "Like Post"}
            trigger={
                <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => likePost()}
                >
                    {likeButton}
                    <Label basic color="teal" pointing="left">
                        {likeCount}
                    </Label>
                </Button>
            }
        />
    );
};

const LIKE_POST = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id
                username
            }
            likeCount
        }
    }
`;
