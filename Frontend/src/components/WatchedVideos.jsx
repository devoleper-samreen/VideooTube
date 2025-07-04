import React from 'react';
import { useGetWatchedVideosQuery } from '../../redux/api/videoApi';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";

const YourVideos = () => {
    const { data, isLoading, error } = useGetWatchedVideosQuery();

    if (error) return <p>Error fetching videos: {error.message}</p>;
    if (data?.watchedVideos?.length === 0) return <p>No videos found for this user.</p>;
    if (isLoading) {
        return (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 cursor-pointer">
                {Array.from(new Array(6)).map((_, index) => (
                    <Card key={index} className="rounded-lg overflow-hidden shadow-lg min-h-[260px]">
                        <Skeleton variant="rectangular" height={200} />
                        <CardContent className="flex items-center justify-between">
                            <Skeleton variant="circular" width={48} height={48} />
                            <div className="flex flex-col text-right w-full ml-3">
                                <Skeleton width="80%" height={20} />
                                <Skeleton width="60%" height={15} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 cursor-pointer">
            {data?.watchedVideos?.map((video) => (
                <Link to={`/video/${video._id}`} key={video._id}>
                    <Card className="rounded-lg overflow-hidden shadow-lg min-h-[260px]">
                        <CardMedia component="img" image={video?.thumbnail} alt={video?.title} sx={{ height: 200 }} />
                        <CardContent className="flex items-center justify-between">
                            {/* Left Side - Profile Picture */}
                            <img
                                src={video?.profileDetails?.profilePicture}

                                className="w-12 h-12 rounded-full object-cover bg-amber-300"
                            />

                            {/* Right Side - Title & Channel Name */}
                            <div className="flex flex-col text-right w-full ml-3">
                                <Typography component="h5" noWrap>
                                    {video?.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {video?.ownerDetails?.name}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
};

export default YourVideos;
