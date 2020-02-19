import React, { Component } from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'

import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import ListGroup from 'react-bootstrap/ListGroup'

import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Formik } from 'formik'

import ReactPlayer from 'react-player'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faBullhorn, faThumbsUp, faThumbsDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import RoomSocketsContext from './Contexts/RoomSockets'

// import { useSelector } from 'react-redux'
// import { isLoaded } from 'react-redux-firebase'
import firebase from 'firebase/app'
import { useFirebase } from 'react-redux-firebase'

import * as yup from 'yup'
const messageSchema = yup.object({
  message: yup.string().required()
})

export default class App extends Component {
  static contextType = RoomSocketsContext

  state = { messages: [] }

  componentDidMount = () => {
    this.context.chatSocket.on('messages', message => {
      const existingMessages = this.state.messages.slice(0, 255)
      this.setState({ messages: [ ...existingMessages, message ] })
    })
  }

  onSubmitMessage = ({ message }, { resetForm }) => {
    this.context.chatSocket.emit('message', { message }, () => resetForm())
  }

  render() {
    // firebase = useFirebase()

    return (
      <Container fluid className="vh-100">
        <Navbar as={ Row } variant="dark" style={{ height: '3em' }}>
          <Navbar.Brand>
            <FontAwesomeIcon icon={ faBullhorn } />
            <span className="ml-2">BumpChat</span>
          </Navbar.Brand>
        </Navbar>

        <Row className="position-absolute w-100" style={{ top: '3em', bottom: 0 }}>
          <Col as={ Card } lg={ 3 } className="d-none d-lg-block px-0 rounded-0">
            <Card.Header>Up Next</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>Cras justo odio</ListGroup.Item>
              <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
              <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
            </ListGroup>
          </Col>

          <Col as={ Card } xs={ 12 } lg={ 9 } className="position-relative rounded-0">

            <Card.Header as={ Row } className="p-0" style={{ height: '15em' }}>
              <Col xs={ 6 } sm={ 5 } md={ 4 } xl={ 3 } className="p-0">
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
                  width="100%"
                  height="100%"
                />
              </Col>
              <Col xs={ 6 } sm={ 7 } md={ 8 } xl={ 9 } className="py-3">
                <Row>
                  <Col xs={ 12 } md={ 7 } xl={ 9 }>
                    <h5>Name</h5>
                  </Col>
                  <Col xs={ 12 } md={ 5 } xl={ 3 }>
                    <div className="d-flex flex-column">
                      <ToggleButtonGroup name="songvote" defaultValue={ undefined }>
                        <ToggleButton value={ true } variant="secondary" className="py-4">
                          <FontAwesomeIcon size="2x" icon={ faThumbsUp } />
                        </ToggleButton>
                        <ToggleButton value={ false } variant="secondary" className="py-4">
                          <FontAwesomeIcon size="2x" icon={ faThumbsDown } />
                        </ToggleButton>
                      </ToggleButtonGroup>
                      <Button variant="link">
                        <small className="text-danger">
                          <FontAwesomeIcon icon={ faFlag } />
                          <span className="ml-2">Report</span>
                        </small>
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Card.Header>

            <Card.Body className="p-0 position-absolute" style={{ top: '15em', bottom: '3em', left: 0, right: 0 }}>
              <ListGroup variant="flush" className="align-bottom h-100" style={{ overflow: 'auto' }}>
                { this.state.messages.map(message => (
                  <ListGroup.Item>
                    <Image src="/logo192.png" roundedCircle style={{ width: '2em' }} />
                    <span className="ml-2">Username</span>
                    <p>{ message.message }</p>
                  </ListGroup.Item>
                )) }
              </ListGroup>
            </Card.Body>

            <Card.Header className="position-absolute p-2" style={{ bottom: 0, left: 0, right: 0 }}>
              <Formik initialValues={{ message: '' }}
                validationSchema={ messageSchema }
                onSubmit={ this.onSubmitMessage }
              >
                {({
                  handleSubmit, handleChange, handleBlur,
                  values, touched, isValid, errors
                }) => (
                  <Form noValidate onSubmit={ handleSubmit }>
                    <input type="hidden" value="prayer" />

                    <Form.Row>
                      <Form.Group as={ Col } className="m-0">
                        <InputGroup>

                          <InputGroup.Prepend>
                            <Button variant="secondary">@</Button>
                          </InputGroup.Prepend>

                          <Form.Control
                            size="lg"
                            type="text"
                            name="message"
                            value={ values.message }
                            onBlur={ handleBlur }
                            onChange={ handleChange }
                            className="rounded-0"
                            autoComplete="off"
                            isValid={ touched.message && !errors.message }
                          />

                          <InputGroup.Append>
                            <Button type="submit" variant="success">
                              <FontAwesomeIcon icon={ faPaperPlane } />
                            </Button>
                          </InputGroup.Append>

                        </InputGroup>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                )}
              </Formik>
            </Card.Header>

          </Col>

        </Row>
      </Container>
    )
  }
}
