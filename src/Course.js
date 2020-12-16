import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false
    }
    this.rating = React.createRef();
    this.bookmark = React.createRef();
  }

  render() {
    if (this.props.type === "all") {
      return (
        <Card style={{marginTop: '5px', marginBottom: '5px'}}>
          <Card.Body>
            <Card.Title>
              <div style={{maxWidth: 250}}>
                {this.props.data.name}
              </div>
              {this.getExpansionButton()}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
            {this.getDescription()}
            {this.getStatus()}
          </Card.Body>
        </Card>
      );
    } else if (this.props.type === "cart") {
      return (
        <Card style={{marginTop: '5px', marginBottom: '5px'}}>
          <Card.Body>
            <Card.Title>
              <div style={{maxWidth: 250}}>
                {this.props.data.name}
              </div>
              {this.getExpansionButton()}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
            {this.getDescription()}
            <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
            <Form>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Bookmark" ref={this.bookmark} onChange={() => this.setBookmark()}/>
              </Form.Group>
            </Form>
          </Card.Body>
          <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.data.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.getSections()}
            </Modal.Body>
            <Modal.Footer>
              {this.getCourseButton()}
              <Button variant="secondary" onClick={() => this.closeModal()}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Card>
      );
    } else if (this.props.type === "completed") {
      return (
        <Card style={{marginTop: '5px', marginBottom: '5px'}}>
          <Card.Body>
            <Card.Title>
              <div style={{maxWidth: 250}}>
                {this.props.data.name}
              </div>
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
            <Form>
              <Form.Group controlId="formRating">
                <Form.Control as="select" ref={this.rating} onClick={() => this.setRating()}>
                  <option>No Rating</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <Card style={{marginTop: '5px', marginBottom: '5px'}}>
          <Card.Body>
            <Card.Title>
              <div style={{maxWidth: 250}}>
                {this.props.data.name}
              </div>
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
            <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
          </Card.Body>
          <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.data.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.getSections()}
            </Modal.Body>
            <Modal.Footer>
              {this.getCourseButton()}
              <Button variant="secondary" onClick={() => this.closeModal()}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Card>
      );
    }
  }

  getStatus() {
    if (this.props.completedCourses.findIndex((x) => {return x.number===this.props.courseKey}) !== -1) {
      return <i>You have already completed this course.</i>
    }
    let notTakenCourses = this.getAllRequisites(this.props.courseKey);
    if (notTakenCourses.length > 0) {
      return <i>The requisite "{notTakenCourses.join(' OR ')}" is not met!</i>
    }
    return <>
      <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
      <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.getSections()}
        </Modal.Body>
        <Modal.Footer>
          {this.getCourseButton()}
          <Button variant="secondary" onClick={() => this.closeModal()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  }

  getAllRequisites() {
    let requisite_arr = [];
    for (const requisite of this.props.data.requisites) {
      let met = false;
      for (const r of requisite) {
        if (this.props.completedCourses.findIndex((x) => {return x.number===r}) !== -1) {
          met = true;
          break;
        }
      }
      if (!met) {
        for (const r of requisite) {
          requisite_arr.push(r);
        }
      }
    }
    return requisite_arr;
  }

  setBookmark() {
    if (this.bookmark.current.checked) {
      this.props.addBookmark(this.props.data.number);
    } else {
      this.props.removeBookmark(this.props.data.number);
    }
  }

  getCourseButton() {
    let buttonVariant = 'dark';
    let buttonOnClick = () => this.addCourse();
    let buttonText = 'Add Course';

    if(this.props.courseKey in this.props.cartCourses) {
      buttonVariant = 'outline-dark';
      buttonOnClick = () => this.removeCourse();
      buttonText = 'Remove Course'
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    )
  }

  getSections() {
    let sections = [];

    for (let i =1; i < this.props.data.sections.length + 1; i++){
      sections.push (
        <Accordion defaultActiveKey={i}>
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
              {"Section " + i}
              {this.getSectionButton(i-1)}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>
                {JSON.stringify(this.props.data.sections[i-1].time)}
                {this.getSubsections(i, this.props.data.sections[i-1])}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )
    }

    return sections
  }

  getSectionButton(section) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = 'Add Section';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = 'outline-dark';
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = 'Remove Section';
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  addCourse() {
    this.props.addCartCourse (
      {
        course: this.props.courseKey
      }
    );
  }

  removeCourse() {
    this.props.removeCartCourse (
      {
        course: this.props.courseKey
      }
    );
  }

  addSection(e, section) {
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  addSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );

  }

  getSubsections(sectionKey, sectionValue) {
    let subsections = [];

    for (let i =1; i < sectionValue.subsections.length + 1; i++){  
    subsections.push (
        <Card key={i}>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
            {"Subsection" + i}
            {this.getSubsectionButton(sectionKey, i-1)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i}>
            <Card.Body>
              {JSON.stringify(sectionValue.subsections[i-1].time)}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )
    }

    return (
      <Accordion className="pt-2" defaultActiveKey="0">
        {subsections}
      </Accordion>
    )
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = 'Add Subsection';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        if(this.props.cartCourses[this.props.courseKey][section].indexOf(subsection) > -1) {
          buttonVariant = 'outline-dark';
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = 'Remove Subsection';
        }
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  setExpanded(value) {
    this.setState({expanded: value});
  }

  getExpansionButton() {
    let buttonText = 'More Info';
    let buttonOnClick = () => this.setExpanded(true);

    if(this.state.expanded) {
      buttonText = 'Collapse';
      buttonOnClick = () => this.setExpanded(false)
    }

    return (
      <Button variant='outline-dark' style={{height: 20, fontSize: 12, paddingTop: 0}} onClick={buttonOnClick}>{buttonText}</Button>
    )
  }

  getDescription() {
    if(this.state.expanded) {
      return (
        <div>
          {this.props.data.description}
        </div>
      )
    }
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }

  setRating() {
    if (this.rating.current != null) {
      let score = parseInt(this.rating.current.value);
      if (!isNaN(score) && score > 3) {
        this.props.addHighlyRatedCourse(this.props.data);
      } else {
        this.props.removeHighlyRatedCourse(this.props.data);
      }
    }
  }
}

export default Course;
