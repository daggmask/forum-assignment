import React, {  useState, useContext, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from "reactstrap";
import {checkIfModerator, checkIfModHasAuthorities} from '../helpers/helpers'
import {UserContext} from "../context/userContext"
import {PostContext} from '../context/postContext'

const PostCreation = () => {
  const {render,setRender} = useContext(PostContext)
  const {user} = useContext(UserContext)
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [postSubject, setPostSubject] = useState("General")
  const [moderatorPost, setModeratorPost] = useState(false)
  const [moderatorAuth, setModeratorAuth] = useState(false)

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal)
    if(!modal){
      setPostTitle("")
      setPostContent("")
      setPostSubject("General")
      setModeratorPost(false)
    }
  };

  const getSubjectObject = (subject) => {
    if(subject === "General"){
      return {id: 1, subject: subject}
    }
    if(subject === "Gaming"){
      return {id: 2, subject: subject}
    }
    if(subject === "Daily"){
      return {id: 3, subject: subject}
    }
    if(subject === "Memes"){
      return {id: 4, subject: subject}
    }
  }

  const createPost = async () => {
    let subject = getSubjectObject(postSubject)
    let post = {
      creator: user.username,
      creatorId: user.id, 
      title:postTitle, 
      content: postContent, 
      subject: subject.subject,
      subjectId: subject.id , 
      timePosted: new Date().getTime(),
      postedByModerator: moderatorPost ? 1 : 0
    }

    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    .then((res) => res.json())
    .then(() => setModal(false))
    .catch((error) => console.error(error));

    //Trigger render on posts
    setRender(!render)
  }

  useEffect(() => {
    let authorityList = checkIfModerator(user)
    if(checkIfModHasAuthorities(authorityList, postSubject) !== null){
      setModeratorAuth(true)
    }
    else{
      setModeratorAuth(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[postSubject])


  return (
    <div> 
         <div>
      {user ? 
      <Button className="forum-button" onClick={toggle}>
        Create post
      </Button>
      : null}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader className="text-center mx-auto">Create a post</ModalHeader>
        <ModalBody>
          <Form>
          <FormGroup className="col-xs-8 col-sm-12 col-md-12 col-lg-12 mt-2">
            <Label for="postTitle">Title</Label>
            <Input placeholder="Title..." onChange={((e) => setPostTitle(e.target.value))} id="postTitle" />
            </FormGroup>
            <FormGroup className="col-xs-8 col-sm-12 col-md-12 col-lg-12 mt-2">
            <Label for="postContent">Content</Label>
            <Input type="textarea" placeholder="Enter content..." onChange={((e) => setPostContent(e.target.value))} id="postContent" />
            </FormGroup>
            <FormGroup className="col-xs-8 col-sm-12 col-md-12 col-lg-12 mt-2">
              <Label
             for="Subject" className="forum-dark-grey font-weight-bold col-12 custom-password-label">
              Subject
             <Input type="select" onChange={((e) => setPostSubject(e.target.value))}>
               <option>General</option>
               <option>Gaming</option>
               <option>Daily</option>
               <option>Memes</option>
             </Input>
            </Label>
            {
              //HERE NEEDS MOD CHECK ON CORRECT MOD AREA
            // eslint-disable-next-line no-mixed-operators
            moderatorAuth || user && user.userRole === "admin" ?
            <Label className="m-2">
            <Input type="checkbox" onChange={() => setModeratorPost(!moderatorPost)}/>
              Create warning post
            </Label>
            : null}
            </FormGroup>
            <FormGroup className="col-xs-8 col-sm-12 col-md-12 col-lg-12 mt-2">
              <Button className="forum-button col-xs-8 col-sm-12 col-md-12 col-lg-12 font-weight-bold" onClick={() => createPost()}>
                Post
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="forum-button" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
    </div>
  )
}

export default PostCreation