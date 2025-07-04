import { useState } from "react";
import { usePublishVideoMutation } from "../../redux/api/upload";
import { Button, TextField, Card, CardContent, Typography, Stack } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Loader from "./loader"

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Upload = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const navigate = useNavigate()

    const [publishVideo, { isLoading }] = usePublishVideoMutation();

    // Handle Thumbnail Upload
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file)); // Thumbnail preview
        }
    };

    // Handle Video Upload
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            setVideoPreview(URL.createObjectURL(file)); // Video preview
        }
    };

    const handleUpload = async () => {
        if (!title || !description || !video || !thumbnail) {
            alert("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", video);
        formData.append("thumbnail", thumbnail);

        try {
            await publishVideo(formData).unwrap();
            toast.success("video upload successfully!")
            navigate("/")
        } catch (error) {
            toast.error(error?.data?.message || "Error in video uploading");

        }
    };

    return (
        <Card sx={{ maxWidth: 500, margin: "auto", mt: 5, p: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Upload Video</Typography>
                <TextField
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
                <Stack direction="column" spacing={3} sx={{ mt: 3 }}>

                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        color="secondary"
                    >
                        Upload Thumbnail
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleThumbnailChange}
                            multiple
                        />
                    </Button>
                    {/* Thumbnail Preview */}
                    {thumbnailPreview && (
                        <img src={thumbnailPreview} alt="Thumbnail Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8 }} />
                    )}

                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        color="secondary"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload Video
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleVideoChange}
                            multiple
                        />
                    </Button>
                    {/* Video Preview */}
                    {videoPreview && (
                        <video src={videoPreview} controls style={{ width: "100%", maxHeight: 300, borderRadius: 8 }} />
                    )}
                </Stack>


                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 4 }}
                    onClick={handleUpload}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader /> : "Publish"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default Upload;
