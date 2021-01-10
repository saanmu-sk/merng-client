import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../utils/graphql'
import { useForm } from '../utils/hooks'

const PostForm = () => {
    const { onChange, onSubmit, values } = useForm(postCallback, {
        body: ''
    })
    function postCallback() {
        createPost()
    }

    const [createPost] = useMutation(CREATE_POST, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY, data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                }
            })
            values.body = ''
        },
        onError(err) {
            console.log(err)
        }
    })
    return (
        <div>
            <Form onSubmit={ onSubmit }>
                <h2>Create a post: </h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi world!"
                        name="body"
                        onChange={onChange}
                        value={ values.body }
                    />
                    <Button color="teal" type="submit">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
        </div>
    )
}

const CREATE_POST = gql`
    mutation createPost($body: String!){
        createPost(body: $body) {
            id username createdAt body likeCount commentCount likes {
                id username createdAt
            }
            likes {
                id username createdAt
            }
        }
    }
`

export default PostForm
