import React, {useState} from 'react';
import gql from 'graphql-tag';
import {Button, Icon, Confirm, Popup} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import {FETCH_POSTS_QUERY} from '../util/graphql';
import MyPopup from '../util/MyPopup';

const DeleteButton = ({postId, commentId, callback}) => {

  const [confirmOpen, setConfirmOpen] = useState(false)

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy){
      setConfirmOpen(false);
      if(!commentId){
        const data = proxy.readQuery({
          query:FETCH_POSTS_QUERY
        })
        let newData = data.getPosts.filter(p=>p.id !== postId);
        newData = [newData];
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY, 
          data:{
            ...data,
            getPosts:{
              newData
            }
          }
        });
      }
      if(callback){
        callback();
      }
    },
    variables:{
      postId,
      commentId
    }
  })

  return (
    <>
   <MyPopup
   content= {commentId ? 'Delete Comment' : 'Delete Post'}>
        <Button 
    color="red" onClick={()=>setConfirmOpen(true)}
    floated="right"
    >
      <Icon name="trash" style={{margin:0}}/>
    </Button>
   </MyPopup>
    <Confirm
      open={confirmOpen}
      onCancel={()=> setConfirmOpen(false)}
      onConfirm={deletePostOrMutation}
    />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
mutation deletePost($postId:ID!){
  deletePost(postId: $postId)
}
`;

const DELETE_COMMENT_MUTATION = gql`
mutation deleteComment($postId:ID!, $commentId:ID!){
  deleteComment(postId:$postId, commentId:$commentId){
    id comments{
      id username createdAt body
    }
    commentCount
  }
}
`;


export default DeleteButton
