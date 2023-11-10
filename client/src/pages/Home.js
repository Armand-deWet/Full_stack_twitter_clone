import React from 'react'
import axios from 'axios'
import { useEffect, useState, useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const Home = () => {

    const [listOfPosts, setListOfPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const { authState } = useContext(AuthContext)
    const navigate = useNavigate()

    // useEffect(() => {
    //   console.log('home')
    //       if (!authState.status) {
    //         navigate('/login')
    //       } else {axios.get('http://localhost:3001/posts', {headers: {
    //         accessToken: localStorage.getItem('accessToken')
    //       }}).then((response) => {
    //       setListOfPosts(response.data.listOfPosts)
    //       setLikedPosts(response.data.likedPosts.map((like) => {
    //         return like.PostId
    //       }))
    //       })}
    //     }, [])

    useEffect(() => {
          {axios.get('http://localhost:3001/posts', {headers: {
            accessToken: localStorage.getItem('accessToken')
          }}).then((response) => {
            if (response.data.error) {
              navigate('/login')
            } else {
              setListOfPosts(response.data.listOfPosts)
              setLikedPosts(response.data.likedPosts.map((like) => {
              return like.PostId
          }))
            }
          })}
        }, [])

    const likePost = (PostId) => {
      axios.post('http://localhost:3001/likes', {PostId: PostId}, {headers: {
        accessToken: localStorage.getItem('accessToken')
      }}).then((response) => {
        setListOfPosts(listOfPosts.map((post) => {
          if (post.id === PostId) {
            if (response.data.liked) {
              return {...post, Likes: [...post.Likes, 0]}
            } else {
              const likesArray = post.Likes
              likesArray.pop()
              return {...post, Likes: likesArray}
            }
          } else {
            return post
          }
        }))
        if (likedPosts.includes(PostId)) {
          setLikedPosts(likedPosts.filter((id) => {
            return id != PostId 
          }))
        } else {
          setLikedPosts([...likedPosts, PostId])
        }
      })
    }
    return (
        <div>
        {listOfPosts.map((value, key) => {
          return (
            <div className = 'post' key={key}>
              <div className='title'>{value.title}</div>
              <div className='body' onClick={() => {navigate(`/post/${value.id}`)}}>{value.postText}</div>
              <div className='footer'>
                <div className='username'><Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                  <div className='buttons'>
                    <ThumbUpAltIcon onClick={() => {likePost(value.id)}} className={likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"}/>
                    <label>{value.Likes.length}</label></div>
                  </div>
              </div>
            </div>
          )
        })}
        </div>
    )
    }

export default Home
