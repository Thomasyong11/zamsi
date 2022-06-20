import { useState, useEffect } from "react";
import { Select, Button, Avatar, Badge } from "antd";

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleChange,
  handleImage,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove,
  editPage = false,
}) => {
  const children = [];
  for (let i = 9.99; i <= 99.99; i++) {
    children.push(<Option key={i.toFixed(2)}>GHC{i.toFixed(2)}</Option>);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Title"
          value={values.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group pt-3">
        <textarea
          className="form-control"
          name="description"
          cols="7"
          rows="7"
          placeholder="
          For Heading # H1, ## H2, ###H3; **bold text**, hit enter key twice for next line"
          value={values.description}
          onChange={handleChange}
        >
          {" "}
        </textarea>
      </div>
      <div className="row pt-3">
        <div className="col-md-10">
          <div className="form-group">
            <Select
              style={{ width: "100%" }}
              size="large"
              value={values.paid}
              onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
            >
              <Option value={true}>Paid</Option>
              <Option value={false}>Free</Option>
            </Select>
          </div>
        </div>
        {values.paid && (
          <div className="col-md-2">
            <div className="form-group">
              <Select
                value={values.price}
                style={{ width: "100%" }}
                onChange={(v) => setValues({ ...values, price: v })}
                tokenSeparators={[,]}
                size="large"
              >
                {children}
              </Select>
            </div>
          </div>
        )}
      </div>
      <div className="form-group pt-3">
        <input
          type="text"
          name="category"
          className="form-control"
          placeholder="Category"
          value={values.category}
          onChange={handleChange}
        />
      </div>
      <div className="form-row pt-3">
        <div className="col">
          <div className="form-group">
            <label className="me-5 btn btn-outline-secondary btn-block text-left">
              {uploadButtonText}
              <input
                type="file"
                name="image"
                onChange={handleImage}
                accept="image/*"
                hidden
              />
            </label>
            {preview && (
              <Badge count="x" className="pointer" onClick={handleImageRemove}>
                <Avatar width={200} src={preview} />
              </Badge>
            )}

            {editPage && values.image && (
              <Badge count="x" className="pointer" onClick={handleImageRemove}>
                <Avatar width={200} src={values.image.Location} />
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="row pt-3">
        <div className="col">
          <Button
            onClick={handleSubmit}
            disabled={values.loading || values.uploading}
            className="btn btn-primary"
            loading={values.loading}
            type="primary"
            size="large"
            shape="round"
          >
            {values.loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CourseCreateForm;
