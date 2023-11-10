import React from 'react'
import { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

const CreatePost = () => {

  const {authState} = useContext(AuthContext)
  let navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:3001/posts/auth', { headers: {
      accessToken: localStorage.getItem('accessToken')
    }}).then((response) => {
      if (response.data.error) {
        navigate('/login')
      }
    })
  }, [])

    const initialValues = {
        title: '', 
        postText: '',
    }

    const onSubmit = async (data) => {

        await axios.post('http://localhost:3001/posts', data, { headers: {
          accessToken: localStorage.getItem('accessToken')
        }}).then((response) => {
            navigate('/')
        })
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('you must input a title'),
        postText: Yup.string().required(),
    })

  return (
    <div className='createPostPage'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='formContainer'>
            <label>Title: </label>
            <ErrorMessage name='title' component='span' />
            <Field id='inputCreatePost' name='title' placeholder='(Ex. Title...)' />
            <label>Post: </label>
            <ErrorMessage name='postText' component='span' />
            <Field id='inputCreatePost' name='postText' placeholder='(Ex. Post...)' />

            <button type='submit'>Create Post</button>
        </Form>
      </Formik>
    </div>
  )
}

export default CreatePost
