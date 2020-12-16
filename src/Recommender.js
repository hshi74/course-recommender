class Recommender {
  recommend(courses, completedCourses, highlyRatedCourses, requiredCourses) {
    // console.log(requiredCourses);
    let recommendedCourses = [];
    let interestAreas = [];
    for (let i = 0; i < highlyRatedCourses.length; i++) {
      for (const key of highlyRatedCourses[i].keywords) {
        if (interestAreas.indexOf(key) === -1)
          interestAreas.push(key);
      }
    }
    for (const course of courses) {
      let isComplete = false;
      for (const completedCourse of completedCourses) {
        if (course.number === completedCourse.number) {
          isComplete = true;
          break;
        }
      }
      if (!isComplete) {
        let score = 0;
        for (const key of course.keywords) {
          if (interestAreas.includes(key)) {
            score += 1;
          }
        }
        if (requiredCourses.includes(course.number)) {
          score += 5;
        }
        if (score > 0) {
          recommendedCourses.push({"course": course, "score": score});
        }
      }
    }
    let recommendedCoursesSorted = recommendedCourses.sort(function(a, b){return b["score"] - a["score"]});
    let recommendedCoursesData = [];
    for (const tuple of recommendedCoursesSorted) {
      recommendedCoursesData.push(tuple["course"]);
    }
    return recommendedCoursesData;
  }
}

export default Recommender;