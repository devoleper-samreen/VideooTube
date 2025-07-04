import { useGetUserVideosQuery } from "../../redux/api/videoApi";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
} from "@mui/material";
import { VideoCameraFront } from "@mui/icons-material";

const YourVideos = () => {
  const { data, error, isLoading } = useGetUserVideosQuery();
  const videos = data?.AllVideos || [];

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="rounded-lg shadow-md overflow-hidden">
            <Skeleton variant="rectangular" height={180} />
            <CardContent>
              <Skeleton variant="text" width="80%" height={25} />
              <Skeleton variant="text" width="60%" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 font-medium">
        Error fetching your videos: {error.message}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
        <VideoCameraFront fontSize="large" className="text-gray-400 mb-4" />
        <Typography variant="h6" gutterBottom>
          You haven’t uploaded any videos yet.
        </Typography>
        <Typography variant="body2">
          Start sharing your amazing content with the world.
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Link to={`/video/${video._id}`} key={video._id}>
          <Card className="rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <CardMedia
              component="img"
              height="180"
              image={video?.thumbnail}
              alt={video?.title}
              className="object-cover"
            />
            <CardContent>
              <Typography variant="subtitle1" className="font-semibold" noWrap>
                {video?.title}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default YourVideos;
