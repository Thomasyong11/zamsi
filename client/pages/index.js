import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";

const Index = ({ courses }) => {
  // const [courses, setCourses] = useState([]);
  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     const { data } = await axios.get("/api/courses");
  //     setCourses(data);
  //   };
  //   fetchCourses();
  // }, []);
  return (
    <>
      <h1 className="display-4 jumbotron p-4 text-center bg-primary square">
        Online Education Marketplace
        {/* <sub>Online Education Marketplace</sub> */}
      </h1>
      <div className="container-fluid">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              {/* {<pre>{JSON.stringify(course, null, 4)}</pre>} */}
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>

      <p>By Adjamkwalim Akum-Yong</p>
    </>
  );
};

// getting data from server //serverside rendering
export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data,
    },
  };
}

export default Index;
