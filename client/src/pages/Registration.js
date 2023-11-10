import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Registration = () => {

    let navigate = useNavigate()

    const initialValues = {
        username: '',
        password: ''
    }

        const onSubmit = (data) => {
            axios.post('http://localhost:3001/auth', data).then((response) => {
                console.log(data)
                navigate('/')
            })
        }

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required()
    })

  return (
    <div className='loginContainer'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='formContainer'>
            <label>Username: </label>
            <ErrorMessage name='username' component='span' />
            <Field id='inputCreatePost' name='username' placeholder='(Ex. John...)' />

            <label>Password: </label>
            <ErrorMessage name='password' component='span' />
            <Field id='inputCreatePost' name='password' placeholder='(Ex. password...)' type='password' />

            <button type='submit'>Register</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Registration
