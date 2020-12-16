import React from 'react';
import './App.css';
import Course from './Course';
import {CardColumns} from 'react-bootstrap'

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];
    
    if (this.props.type === "cart") {
      if (Array.isArray(this.props.data)){
        for(let i =0; i < this.props.data.length; i++){
          courses.push (
            <Course key={i} type={this.props.type} data={this.props.data[i]} courseKey={this.props.data[i].number} 
              addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} 
              cartCourses={this.props.cartCourses} addBookmark={this.props.addBookmark} removeBookmark={this.props.removeBookmark}/>
          )
        }
      } else {
        for(const course of Object.keys(this.props.data)){
          courses.push (
            <Course key={this.props.data[course].number} type={this.props.type} data={this.props.data[course]} courseKey={this.props.data[course].number} 
            addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} 
            cartCourses={this.props.cartCourses} addBookmark={this.props.addBookmark} removeBookmark={this.props.removeBookmark}/>
          )
        }
      }
    } else if (this.props.type === "completed") {
      if (Array.isArray(this.props.data)){
        for(let i =0; i < this.props.data.length; i++){
          courses.push (
            <Course key={i} type={this.props.type} data={this.props.data[i]} courseKey={this.props.data[i].number} 
              addHighlyRatedCourse={(data) => this.props.addHighlyRatedCourse(data)} removeHighlyRatedCourse={(data) => this.props.removeHighlyRatedCourse(data)}/>
          )
        }
      } else {
        for(const course of Object.keys(this.props.data)){
          courses.push (
            <Course key={this.props.data[course].number} type={this.props.type} data={this.props.data[course]} courseKey={this.props.data[course].number} 
              addHighlyRatedCourse={(data) => this.props.addHighlyRatedCourse(data)} removeHighlyRatedCourse={(data) => this.props.removeHighlyRatedCourse(data)}/>
          )
        }
      }
    } else if (this.props.type === "recommended") {
      if (Array.isArray(this.props.data)){
        for(let i =0; i < this.props.data.length; i++){
          courses.push (
            <Course key={i} type={this.props.type} data={this.props.data[i]} courseKey={this.props.data[i].number}
              addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} 
              cartCourses={this.props.cartCourses}/>
          )
        }
      } else {
        for(const course of Object.keys(this.props.data)){
          courses.push (
            <Course key={this.props.data[course].number} type={this.props.type} data={this.props.data[course]} courseKey={this.props.data[course].number}
              addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} 
              cartCourses={this.props.cartCourses}/>
          )
        }
      }
    } else {
      if (Array.isArray(this.props.data)){
        for(let i =0; i < this.props.data.length; i++){
          courses.push (
            <Course key={i} type={this.props.type} data={this.props.data[i]} courseKey={this.props.data[i].number} 
              addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} 
              cartCourses={this.props.cartCourses} starCourses={this.props.starCourses} completedCourses={this.props.completedCourses}/>
          )
        }
      } else {
        for(const course of Object.keys(this.props.data)){
          courses.push (
            <Course key={this.props.data[course].number} type={this.props.type} data={this.props.data[course]} courseKey={this.props.data[course].number} 
              addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} 
              cartCourses={this.props.cartCourses} starCourses={this.props.starCourses} completedCourses={this.props.completedCourses}/>
          )
        }
      }
    }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }

  render() {
    return (
      <CardColumns style={{margin: '5px', paddingTop: '10px'}}>
        {this.getCourses()}
      </CardColumns>
    )
  }
}

export default CourseArea;
