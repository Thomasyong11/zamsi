import { Button, Progress, Switch } from "antd";
import { CloseCircleFilled, CloseCircleOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  uploading,
  uploadVideoButtonText,
  handleVideo,
  progress,
}) => {
  return (
    <div className="container pt-1">
      <form onSubmit={handleUpdateLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          placeholder="Title"
          autoFocus
          required
        />
        <textarea
          className="form-control mt-2"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
        ></textarea>
        <div>
          {!uploading && current.video && current.video.Location && (
            <div className="pt-2 justify-content-center p-4">
              <ReactPlayer
                url={current.video.Location}
                width="410px"
                height="240px"
                controls
              />
            </div>
          )}

          <label className="col-md-12 btn btn-dark btn-block text-left mt-3">
            {uploadVideoButtonText}
            <input
              className=""
              onChange={handleVideo}
              type="file"
              accept="video/*"
              hidden
            />
          </label>
        </div>
        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2 positon-relative"
            percent={progress}
            steps={10}
          />
        )}
        <div className="d-flex justify-content-between ">
          <span className="pt-2">Preview</span>
          <Switch
            className="float-end mt-2 "
            disabled={uploading}
            checked={current.free_preview}
            name="free_preview"
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>
        <Button
          onClick={handleUpdateLesson}
          className="col-md-12 mt-2"
          size="large"
          type="primary"
          loading={uploading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default UpdateLessonForm;
