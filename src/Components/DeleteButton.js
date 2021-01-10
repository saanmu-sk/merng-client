import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { Fragment, useState } from 'react'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const DeleteButton = ({ postId,callback, commentId }) => {
    const [open, setOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST
    const [deletePostORComment] = useMutation(mutation, {
        update(proxy) {
            setOpen(false)
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY, data: {
                        getPosts: data.getPosts.filter(p => p.id !== postId)
                    }
                })
            }
            if (callback) callback()
        },
        variables: {
            postId,
            commentId
        }, onError(err) {
            console.log(err)
        }
    })

    return (
        <Fragment>
            <Popup
                content={commentId ? 'Delete comment' : 'Delete Post'}
                inverted
                trigger={
                    <Button color='red' floated="right" onClick={ () => setOpen(true) }>
                        <Icon name='trash' style={{ margin: 0 }}/>
                    </Button>
                }
            />
            <Confirm
                open={open}
                onCancel={() => setOpen(false)}
                onConfirm={ deletePostORComment }
            />
        </Fragment>
    )
}

const DELETE_POST = gql`
    mutation deletePost($postId: String!) {
        deletePost(postId: $postId)
    }
`
const DELETE_COMMENT = gql`
    mutation deleteComment($postId: String! $commentId: String!) {
        deleteComment(postId: $postId commentId: $commentId) {
            id comments {
                id username createdAt body
            }
            commentCount
        }
    }
`
export default DeleteButton
