import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  Paper,
  Skeleton,
} from "@mui/material";
import { useGetStatsQuery } from "../../redux/api/dashboardApi";
import { useGetUserVideosQuery } from "../../redux/api/videoApi";
import { Link } from "react-router-dom";
import { useDeleteVideoMutation } from "../../redux/api/dashboardApi";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useUpdateVideoMutation } from "../../redux/api/dashboardApi";

const Dashboard = () => {
  const { data: stats, isLoading } = useGetStatsQuery();
  const { data: uploadedVideosData, isLoading: videosLoading } =
    useGetUserVideosQuery();
  const [deleteVideo] = useDeleteVideoMutation();

  const videos = uploadedVideosData?.AllVideos || [];

  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editThumbnail, setEditThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const handleDelete = async (videoId) => {
    console.log("Delete video: ", videoId);
    try {
      const res = await deleteVideo({ videoId }).unwrap();
      console.log("Deleted successfully:", res);
      toast.success("Video deleted!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete video");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {["Total Videos", "Total Views", "Total Likes"].map((label, index) => {
          const statValue = isLoading
            ? "..."
            : index === 0
            ? stats?.totalVideos
            : index === 1
            ? stats?.totalViews
            : stats?.totalLikes;

          return (
            <Grid item xs={12} sm={4} key={label}>
              <Card
                sx={{
                  background: "#ffffff",
                  boxShadow: 3,
                  border: "1px solid #e0e0e0",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {label}
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {statValue || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Uploaded Videos */}
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        My Uploaded Videos
      </Typography>

      {videosLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 1,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" />
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Skeleton variant="rectangular" width={60} height={35} />
                  <Skeleton variant="rectangular" width={60} height={35} />
                  <Skeleton variant="rectangular" width={60} height={35} />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : videos.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          You haven&apos;t uploaded any videos yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} md={6} key={video._id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 1,
                  border: "1px solid #e0e0e0",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  👁️ Views: {video.views} &nbsp; | &nbsp; ❤️ Likes:{" "}
                  {video.likes}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  display="block"
                  gutterBottom
                >
                  Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setOpenEdit(true);
                      setEditData(video);
                      setEditTitle(video.title);
                      setEditDescription(video.description);
                      setThumbnailPreview(video.thumbnail);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(video._id)}
                  >
                    Delete
                  </Button>
                  <Button variant="outlined" size="small">
                    <Link
                      to={`/video/${video._id}`}
                      key={video._id}
                      className="group"
                    >
                      View
                    </Link>
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Video</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            margin="normal"
          />
          <Button component="label" variant="contained" sx={{ mt: 2 }}>
            Change Thumbnail
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setEditThumbnail(file);
                setThumbnailPreview(URL.createObjectURL(file));
              }}
            />
          </Button>
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              style={{
                width: "100%",
                maxHeight: 200,
                marginTop: "16px",
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={isUpdating}
            onClick={async () => {
              const formData = new FormData();
              formData.append("title", editTitle);
              formData.append("description", editDescription);
              if (editThumbnail) formData.append("thumbnail", editThumbnail);

              try {
                await updateVideo({
                  videoId: editData._id,
                  data: formData,
                }).unwrap();
                toast.success("Video updated successfully");
                setOpenEdit(false);
              } catch (err) {
                toast.error("Failed to update video");
              }
            }}
          >
            {isUpdating ? "Updating..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
