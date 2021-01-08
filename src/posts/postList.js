import React, { useEffect, useState, useContext } from 'react'
import { Row } from "reactstrap";
import PostView from './postView'
import {PostContext} from '../context/postContext'
import PostFilterButton from './postFilterButton'
import {DebounceHelper} from '../helpers/helpers'
import {UserContext} from "../context/userContext"

const PostList = () => {
  const {selectedPost, setSelectedPost} = useContext(PostContext)
  const {user, isMod, setIsMod} = useContext(UserContext)
  const {render} = useContext(PostContext)
  const [postList, setPostList] = useState([])
  
  const [filterOption, setFilterOption] = useState("Any")

  let postDebounce = new DebounceHelper()

  const fetchPosts = async () => {
    await fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => setPostList(data))
      .catch((err) => console.error(err));
  };

  const renderPosts = () => {
    if(filterOption === "Any"){
      return postList
    }
    else{
      return postList.filter(post => post.subject === filterOption)
    }
  }

  const checkModerator = (post) => {
    if(user !== null && post !== null){
      if(user.userRole === "admin") return true
      console.log(user);
      let authList = []
      for(let area in user){
        if(area === "id" || area === "username" || area === "userRole"){
          continue
        }
        if(user[area] !== null){
          authList.push(user[area])
        }
      }
      return authList.indexOf(post.subject) > -1
    }
    else{
      return false
    }
}

const doCheckAndSetPost = (post) => {
  let something = checkModerator(post)
  console.log(something);
  setIsMod(something)
  setSelectedPost(post)
}

  useEffect(() => {
    postDebounce.debounceHelper(fetchPosts)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[render])

  return(
    <div className="col-12 container">
      <PostFilterButton filterOption={filterOption} setFilterOption={setFilterOption}/>
      <Row>
      {renderPosts().map((post,i) => {
        return(
          <div className="col-4" key={post.id + i} onClick={() => doCheckAndSetPost(post)}>
          <PostView post={post}/>
          </div>
        )
      }).sort((a,b) => a.timePosted > b.timePosted ? 1 : -1)}
      </Row>
    </div>
  )
}
export default PostList