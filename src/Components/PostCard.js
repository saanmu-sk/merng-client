import React, { useContext } from 'react'
import { Card, Icon, Label, Image, Button, Popup } from "semantic-ui-react";
import moment from 'moment'
import { Link } from "react-router-dom";

import {AuthContext} from '../context/auth'
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
const PostCard = ({ post: { id, body, createdAt, username, likeCount, commentCount, likes } }) => {

    const { user } = useContext(AuthContext)

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/post/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Popup
                    content="Comment on post"
                    trigger={
                        <Button labelPosition='right' as={Link} to={`/post/${id}`}>
                            <Button color='blue' basic>
                                <Icon name='comments' />
                            </Button>
                            <Label basic color='blue' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                    }
                    inverted
                />
                {user && user.username === username && <DeleteButton postId={ id }/>}
            </Card.Content>
        </Card>
    )
}

export default PostCard
