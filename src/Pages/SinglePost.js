import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useContext, useRef, useState } from 'react'
import { Button, Card, CardContent, Form, Grid, Icon, Image, Label, Popup } from 'semantic-ui-react'
import moment from 'moment'
import LikeButton from '../Components/LikeButton'
import { AuthContext } from '../context/auth'
import DeleteButton from '../Components/DeleteButton'
const SinglePost = (props) => {
    const { user } = useContext(AuthContext)
    const postId = props.match.params.id
    const [comment, setComment] = useState('')
    const commentInputRef = useRef(null)
    const [createComment] = useMutation(CREATE_COMMENT, {
        update() {
            setComment('')
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    const { data: { getPost } = {}} = useQuery(FETCH_POST, {
        variables: {
            postId
        }
    })

    function deletePostCallback() {
        props.history.push('/')
    }

    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, username, createdAt, comments, likes, likeCount, commentCount } = getPost;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={ user } post={ { id, likeCount, likes } }/>
                                <Popup
                                    content="Comment a post"
                                    inverted
                                    trigger={
                                        <Button as="div" labelPosition='right' >
                                            <Button color='blue' basic>
                                                <Icon name='comments' />
                                            </Button>
                                            <Label basic color='blue' pointing='left'>
                                                {commentCount}
                                            </Label>
                                        </Button>
                                    }
                                />
                                {user && user.username === username && <DeleteButton postId={id} callback={ deletePostCallback }/>}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <CardContent>
                                <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={ e => setComment(e.target.value) }
                                            />
                                            <button
                                                type="submit"
                                                disabled={comment.trim() === ''}
                                                onClick={createComment}
                                                className="ui button teal"
                                                ref={ commentInputRef }
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </CardContent>
                            </Card>
                        ) }
                        {comments.map(comment => (
                            <Card fluid key={ comment.id }>
                                <Card.Content>
                                    {user && user.username === username && <DeleteButton postId={id} commentId={ comment.id }/>}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return (
        <div>
            {postMarkup}
        </div>
    )
}

const FETCH_POST = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username likeCount commentCount
            likes {
                username
            }
            comments {
                id username createdAt body
            }
        }
    }
`
const CREATE_COMMENT = gql`
    mutation createComment($postId: String! $body: String!){
        createComment(postId: $postId body: $body){
            id commentCount
            comments {
                id body createdAt username
            }
        }
    }
`

export default SinglePost
