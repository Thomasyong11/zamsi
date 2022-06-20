import { Badge, Modal, Button } from "antd";
import { currencyFormatter } from "../../utils/helper";
import ReactPlayer from "react-player";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";

const SingleCourseView = ({
  course,
  setShowModal,
  setPreview,
  preview,
  showModal,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  loading,
  setLoading,
  enrolled,
  setEnrolled,
}) => {
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;
  return (
    <div>
      <div className="container-fluid p-2 bg-primary square jumbotron  ">
        <div className="row">
          <div className="col-md-8">
            <h1 className="text-light font-weight-bold">{name}</h1>
            <p className="lead">
              {description && description.substring(0, 160)}...
            </p>
            <Badge
              count={category}
              style={{ backgroundColor: "#03a9f4" }} // #03a9f4
              className="mb-4"
            />
            <p>Created by {instructor.name} </p>
            <p> Last updated {new Date(updatedAt).toLocaleString()}</p>
            <h4 className="text-light">
              {paid
                ? currencyFormatter({
                    amount: price,
                    currency: "usd",
                  })
                : "Free"}
            </h4>
          </div>
          <div className="col-md-4">
            {lessons[0].video && lessons[0].video.Location ? (
              <div
                onClick={() => {
                  setPreview(lessons[0].video.Location);
                  setShowModal(!showModal);
                }}
              >
                <ReactPlayer
                  className="react-player-div"
                  url={lessons[0].video.Location}
                  light={image.Location} //thumbnail
                  width="100%"
                  height="250px"
                />
              </div>
            ) : (
              <>
                <img
                  src={image.Location}
                  alt={name}
                  className="img img-fluid"
                />
              </>
            )}
            {/* <p>show enroll button</p> */}
            {loading ? (
              <div className="d-flex justify-content-center">
                <LoadingOutlined className="h1 text-danger" />
              </div>
            ) : (
              <Button
                className="mb-3 mt-3 d-flex justify-content-center align-items-center"
                type="danger"
                block
                shape="round"
                icon={<SafetyOutlined />}
                size="large"
                disabled={loading}
                onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
              >
                {user
                  ? enrolled.status
                    ? "Go to course"
                    : "Enroll"
                  : " Login to enroll"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCourseView;
