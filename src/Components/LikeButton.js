import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
const LikeButton = ({ post: { id, likeCount, likes }, user }) => {
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes])
    
    const [likePost] = useMutation(LIKE_POST, {
        variables: { postId: id }
    })

    const likeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
            <Button color='teal' basic as={ Link } to="/login">
            <Icon name='heart' />
        </Button>
    )
    return (
        <Popup 
            content={liked ? "Unlike" : "Like"}
            inverted
            trigger={
                <Button as='div' labelPosition='right' onClick={ likePost }>
                    {likeButton}
                    <Label basic color='teal' pointing='left'>
                        {likeCount}
                    </Label>
                </Button>
            }
        />
    )
}

const LIKE_POST = gql`
    mutation likePosts($postId: String!){
        likePost(postId: $postId) {
            id
            likeCount
            likes {
                id username
            }
        }
    }
`

export default LikeButton
