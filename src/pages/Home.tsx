import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { Grid, Transition } from "semantic-ui-react";
import styled from "styled-components";
import { PostCard } from "../components/PostCard";
import { PostForm } from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { Post } from "../util/types";

export const Home: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    return (
        <HomeContainer>
            <Grid columns={3}>
                <Grid.Row className="page-title">
                    <h1>Recent posts</h1>
                </Grid.Row>
                <Grid.Row>
                    {user && (
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
                    )}
                    {loading ? (
                        <h1>Loading posts...</h1>
                    ) : (
                        <Transition.Group>
                            {data.getPosts &&
                                data.getPosts.map((post: Post) => (
                                    <Grid.Column
                                        key={post.id}
                                        style={{ marginBottom: 20 }}
                                    >
                                        <PostCard post={post} />
                                    </Grid.Column>
                                ))}
                        </Transition.Group>
                    )}
                </Grid.Row>
            </Grid>
        </HomeContainer>
    );
};

const HomeContainer = styled.div`
    .page-title {
        display: block !important;
        text-align: center;
        font-size: 2rem;
        margin-top: 10px;
    }
`;
