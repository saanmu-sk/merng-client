import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { Grid, Transition } from 'semantic-ui-react'
import PostCard from '../Components/PostCard'
import { AuthContext } from '../context/auth';
import PostForm from '../Components/PostForm';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
const Home = () => {
    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY)
    const { user } = useContext(AuthContext)
    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && <Grid.Column>
                    <PostForm />
                </Grid.Column>}
                {
                    loading ? <h1>Loading posts...</h1> : (
                        <Transition.Group>
                            { posts ? posts.map(post => (
                                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                    <PostCard post={ post } />
                                </Grid.Column>
                            )) : <h1>No Posts Found!</h1> }
                        </Transition.Group>
                    )
                }
            </Grid.Row>
        </Grid>
    )
}

export default Home
