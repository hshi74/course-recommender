import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Recommender from './Recommender';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      interestArea: [],
      cartCourses: {},
      completedCourses: {},
      highlyRatedCourses: [],
      starCourses: []
    };
    
    this.recommender = new Recommender();
  }

  componentDidMount() {
    this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json();

    let completedCourseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let completedCourseList = await (await fetch(completedCourseURL)).json();
    let completedCourseData = [];
    for (const course of courseData) {
      if (completedCourseList["data"].includes(course["number"])) {
        completedCourseData.push(course);
      }
    }

    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData), 
      interestArea: this.getInterestArea(courseData), completedCourses: completedCourseData});
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getInterestArea(data) {
    let interestAreas = [];
    interestAreas.push("All");

    for (let i = 0; i < data.length; i++) {
      for (const key of data[i].keywords) {
        if (interestAreas.indexOf(key) === -1)
          interestAreas.push(key);
      }
    }

    return interestAreas;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses});
  }

  addHighlyRatedCourse(new_course) {
    let slice = this.state.highlyRatedCourses.slice();
    for (const course of slice) {
      if (course.number === new_course.number)
        return;
    }
    slice.push(new_course);
    this.setState({highlyRatedCourses: slice});
  }

  removeHighlyRatedCourse(old_course) {
    let slice = this.state.highlyRatedCourses.slice();
    for (const course of slice) {
      if (course.number === old_course.number) {
        let index = slice.indexOf(course);
        slice.splice(index, 1);
        this.setState({highlyRatedCourses: slice});
        return;
      }
    }
  }

  addBookmark(course) {
    let slice = this.state.starCourses.slice();
    if (!slice.includes(course)) {
      slice.push(course);
      this.setState({starCourses: slice});
    }
  }

  removeBookmark(course) {
    let slice = this.state.starCourses.slice();
    if (slice.includes(course)) {
      let index = slice.indexOf(course);
      slice.splice(index, 1);
      this.setState({starCourses: slice});
    }
  }

  getRecommendedCourses() {
    // console.log(this.state.highlyRatedCourses);
    let requiredCourses = [];
    for (const course of this.state.starCourses) {
      requiredCourses.push(...this.getAllRequisites(course));
    }
    let courses = this.recommender.recommend(this.state.allCourses, this.state.completedCourses, 
      this.state.highlyRatedCourses, requiredCourses);
    return courses;
  }

  getAllRequisites(course) {
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===course})
    if (courseIndex === -1 || this.state.completedCourses.findIndex((x) => {return x.number===course}) !== -1) {
      return [];
    }
    if (this.state.allCourses[courseIndex].requisites.length === 0) {
      return [course];
    }
    let requisite_arr = [];
    for (const requisite of this.state.allCourses[courseIndex].requisites) {
      let met = false;
      for (const r of requisite) {
        if (this.state.completedCourses.findIndex((x) => {return x.number===r}) !== -1) {
          met = true;
          break;
        }
      }
      if (!met) {
        for (const r of requisite) {
          for (const more_r of this.getAllRequisites(r)) {
            if (!requisite_arr.includes(more_r))
              requisite_arr.push(more_r);
          }
        }
      }
    }
    requisite_arr.push(course);
    return requisite_arr;
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    let notTakenCourses = this.getAllRequisites(data.course);

    if (notTakenCourses.length > 1) {
      alert(`Your selected course ${data.course} has course requisites that you don't meet!\n` + 
        `You need to take courses following this path: ${notTakenCourses.join(' -> ')}`)
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }
    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if (this.state.starCourses.includes(data.course)) {
      let slice = this.state.starCourses.slice();
      let index = slice.indexOf(data.course);
      slice.splice(index, 1);
      this.setState({starCourses: slice});
    }

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} interestArea={this.state.interestArea}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea type="all" data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} 
                removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}
                starCourses={this.state.starCourses} completedCourses={this.state.completedCourses}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div className="mx-3">
              <CourseArea type="cart" data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} 
                removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}
                starCourses={this.state.starCourses} addBookmark={(data) => this.addBookmark(data)}
                removeBookmark={(data) => this.removeBookmark(data)}/>
            </div>
          </Tab>
          <Tab eventKey="completed_courses" title="Completed Courses" style={{paddingTop: '5vh'}}>
            <div className="mx-3">
              <p style={{marginTop: "15px", fontSize: "16px"}}>Tip: rate your completed courses to get recommended ones.</p>
              <CourseArea type="completed" data={this.state.completedCourses} 
                addHighlyRatedCourse={(data) => this.addHighlyRatedCourse(data)}
                removeHighlyRatedCourse={(data) => this.removeHighlyRatedCourse(data)}/>
            </div>
          </Tab>
          <Tab eventKey="recommended_courses" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div className="mx-3">
              <CourseArea type="recommended" data={this.getRecommendedCourses()} addCartCourse={(data) => this.addCartCourse(data)} 
                removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
