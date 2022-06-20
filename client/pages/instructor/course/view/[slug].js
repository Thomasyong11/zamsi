import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List, Badge } from "antd";

import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
// form components
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";
const CourseView = () => {
  const [course, setCourse] = useState({});
  //for lessons
  const [visible, setVisible] = useState(false);
  //for lesson form
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);
  const [students, setStudents] = useState(0);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };
  useEffect(() => {
    course && studentCount();
  }, [course]);

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    console.log("student count=>", data.length);
    setStudents(data.length);
  };
  //function for add lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues({ ...values, title: "", content: "", video: {} });
      setVisible(false);
      setUploadButtonText("Upload video");
      setCourse(data);
      toast("lesson added");
    } catch (err) {
      console.log(err);
      toast("Add lesson failed");
    }
  };
  const handleVideo = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      const videoData = new FormData();
      videoData.append("video", file);
      //save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      //once response is successfull
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
      setProgress(0);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast("Video upload failed. Try again later");
    }
  };
  const handleVideoRemove = async (e) => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/remove-video/${course.instructor._id}`,
        values.video
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setProgress(0);
      setUploading(false);
      setUploadButtonText("Upload another video");
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast("Video remove failed. Try again later");
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "once you publish, your course would be available in the marketplace for users to enroll"
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast("Congrats!! your course is live");
    } catch (err) {
      toast("Oops!! Something went wrong. Try again later");
    }
  };
  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "once you unpublish, your course would no longer be available in the marketplace for users to enroll"
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast("Your course is unpublished");
    } catch (err) {
      toast("Oops!! Something went wrong. Try again later");
    }
  };
  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {/* <p>view {slug}</p> */}
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className="container-fluid pt-1">
            <div className="col-md-12 p-2">
              <div className="row">
                <div className="col-md-1 me-4 ">
                  <Avatar
                    className=""
                    size={80}
                    src={course.image ? course.image.Location : "/course.png"}
                  />
                </div>
                <div className="col-md-10 ms-1">
                  <div className="row">
                    <div className="col-md-10  ps-1">
                      <h5 className="mt-2 text-primary">{course.name}</h5>
                      <p style={{ marginTop: "-10px" }}>
                        {course.lessons && course.lessons.length}{" "}
                        {course.lessons && course.lessons.length < 1
                          ? "Lesson"
                          : "Lessons"}
                      </p>
                      <p style={{ marginTop: "-15px", fontSize: "14px" }}>
                        {course.category}
                      </p>
                    </div>
                    <div className="col d-flex me-auto">
                      <Tooltip title="Enrolled">
                        <Badge count={students} offset={[-20, 0]}>
                          <UserSwitchOutlined className="h5 pointer text-info me-4" />
                        </Badge>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <EditOutlined
                          onClick={(e) =>
                            router.push(`/instructor/course/edit/${slug}`)
                          }
                          className="h5 pointer text-warning me-4"
                        />
                      </Tooltip>
                      {course.lessons && course.lessons.length < 5 ? (
                        <Tooltip title="Min 5 lessons required to publish">
                          <QuestionOutlined className="h5 pointer text-danger" />
                        </Tooltip>
                      ) : course.published ? (
                        <Tooltip title="Unpublished">
                          <CloseOutlined
                            className="h5 pointer text-danger"
                            onClick={(e) => handleUnpublish(e, course._id)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Publish">
                          <CheckOutlined
                            className="h5 pointer text-success"
                            onClick={(e) => handlePublish(e, course._id)}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkdown>{course.description}</ReactMarkdown>
              </div>
            </div>
            <div className="row">
              <Button
                onClick={() => setVisible(true)}
                className="col-md-4 offset-md-3 text-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="Large"
              >
                Add Lesson
              </Button>
            </div>
            <br />
            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>
            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>{course.lessons && course.lessons.length} Lessons</h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course.lessons}
                  renderItem={(item, index) => (
                    <Item>
                      <Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></Item.Meta>
                    </Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};
export default CourseView;
