import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helper";

const { Meta } = Card;
const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, category } = course;
  return (
    <Link href={`/course/${slug}`}>
      <a>
        <Card
          style={{
            borderRadius: "10px",
          }}
          className="mb-4"
          cover={
            <img
              src={image ? image.Location : "/course.png"}
              alt={name}
              style={{ height: "200px", objectFit: "cover" }}
              className="p-1"
            />
          }
        >
          <h2 className="font-weight-bold">{name}</h2>
          <p className=""> by: {instructor.name}</p>
          <Badge
            count={category}
            style={{ backgroundColor: "#03a9f4" }}
            className="pb-2 me-2"
          />
          <h4 className="pt-2">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: "usd",
                })
              : "Free"}
          </h4>
        </Card>
      </a>
      {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
    </Link>
  );
};

export default CourseCard;
