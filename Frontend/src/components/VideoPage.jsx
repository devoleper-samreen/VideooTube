import { useParams } from "react-router-dom";
import {
  useGetVideoByIdQuery,
  useIncreaseViewCountMutation,
} from "../../redux/api/videoApi";
import {
  Typography,
  Avatar,
  Button,
  Box,
  Divider,
  Skeleton,
} from "@mui/material";
import { ThumbsUp } from "lucide-react";
import {
  useAddLikeMutation,
  useDeleteLikeMutation,
  useGetLikesCountByVideoQuery,
} from "../../redux/api/likeApi";
import { useState } from "react";
import CommentsSection from "./Comment";

const VideoPage = () => {
  const { videoId } = useParams();
  const { data, isLoading } = useGetVideoByIdQuery(videoId);
  const { data: likesData } = useGetLikesCountByVideoQuery(videoId);
  const [increaseViewCount] = useIncreaseViewCountMutation();

  const [addLike] = useAddLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const [liked, setLiked] = useState(false);

  const handleViewCount = async () => {
    try {
      await increaseViewCount(videoId);
    } catch (error) {
      console.error("Failed to update views", error);
    }
  };

  const handleLike = async () => {
    try {
      if (!liked) {
        await addLike(videoId);
        setLiked(true);
      } else {
        await deleteLike(videoId);
        setLiked(false);
      }
    } catch (err) {
      console.error("Like action failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <Skeleton
          variant="rectangular"
          height={400}
          className="rounded-xl mb-6"
        />
        <Skeleton variant="text" width="60%" height={35} />
        <Skeleton variant="text" width="90%" height={25} className="mb-4" />
        <Divider className="my-4" />
        <Box className="flex items-center gap-4 mb-6">
          <Skeleton variant="circular" width={56} height={56} />
          <Box>
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={18} />
          </Box>
        </Box>
        <Skeleton variant="rectangular" width={140} height={36} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load video.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Video Player */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-6 bg-black">
        <video
          controls
          autoPlay
          className="w-full h-[400px] object-cover"
          onPlay={handleViewCount}
        >
          <source src={data?.video.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Title */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {data?.video?.title}
      </Typography>

      {/* Description */}
      <Typography variant="body1" color="text.secondary" paragraph>
        {data?.video?.description}
      </Typography>

      <Divider className="my-4" />

      {/* Channel Info + Actions */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={data?.ownerProfilePicture?.profilePicture}
            alt="Channel Logo"
            sx={{ width: 56, height: 56 }}
          />
          <div>
            <Typography fontWeight="medium">
              {data?.video?.owner?.name || "Unknown Channel"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data?.video?.views || 0} views
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant={liked ? "contained" : "outlined"}
            startIcon={<ThumbsUp size={20} />}
            onClick={handleLike}
          >
            {likesData?.likesCount || 0} Like
          </Button>
          <Button variant="outlined" color="primary">
            Subscribe
          </Button>
        </div>
      </Box>

      {/* Comments */}
      <CommentsSection videoId={videoId} />
    </div>
  );
};

export default VideoPage;
