import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Badge, Modal } from "antd";
import SingleCourseView from "../../components/cards/SingleCourseView";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import { Context } from "../../context";
import { toast } from "react-toastify";
import { loadStripe, loadstripe } from "@stripe/stripe-js";

const SingleCourse = ({ course }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});

  //context
  const {
    state: { user },
  } = useContext(Context);

  //useEffect
  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    console.log("CHECKED ENROLLMENT", data);
    setEnrolled(data);
  };
  const handlePaidEnrollment = async () => {
    try {
      setLoading(true);
      if (!user) router.push("/login");
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      console.log(data);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
    } catch (err) {
      toast("Enrollment failed, try again");
      console.log(err);
      setLoading(false);
    }
  };
  const handleFreeEnrollment = async (e) => {
    try {
      //check if user is logged in
      //check if user is already enrolled
      if (!user) router.push("/login");
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      toast("Enrollment failed. Try please try again");
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <SingleCourseView
        course={course}
        setShowModal={setShowModal}
        showModal={showModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        setLoading={loading}
        handleFreeEnrollment={handleFreeEnrollment}
        handlePaidEnrollment={handlePaidEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />
      <PreviewModal
        setShowModal={setShowModal}
        showModal={showModal}
        preview={preview}
      />
      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

// getting data from server //serverside rendering
export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
