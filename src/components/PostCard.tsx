import moment from "moment";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Icon, Image, Label, Popup } from "semantic-ui-react";
import styled from "styled-components";
import { AuthContext } from "../context/auth";
import { MyPopup } from "../util/MyPopup";
import { Post } from "../util/types";
import { DeleteButton } from "./DeleteButton";
import { LikeButton } from "./LikeButton";

const PostCardContainer = styled.div``;

export const PostCard: React.FC<{ post: Post }> = ({
    post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) => {
    const { user } = useContext(AuthContext);

    return (
        <PostCardContainer>
            <Card fluid>
                <Card.Content>
                    <Image
                        floated="right"
                        size="mini"
                        src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                    />
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta as={Link} to={`/posts/${id}`}>
                        {moment(createdAt).fromNow(true)}
                    </Card.Meta>
                    <Card.Description>{body}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <LikeButton user={user} post={{ id, likes, likeCount }} />
                    <MyPopup
                        content="Comment on post"
                        trigger={
                            <Button
                                labelPosition="right"
                                as={Link}
                                to={`/posts/${id}`}
                            >
                                <Button color="blue" basic>
                                    <Icon name="comments" />
                                </Button>
                                <Label basic color="blue" pointing="left">
                                    {commentCount}
                                </Label>
                            </Button>
                        }
                    />
                    {user && user.username === username && (
                        <DeleteButton postId={id} />
                    )}
                </Card.Content>
            </Card>
        </PostCardContainer>
    );
};
