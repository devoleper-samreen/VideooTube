import React, { useState, useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useOtpVerifyMutation } from "../../redux/api/auth"
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "./loader"


const OTPInput = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const [otpVerify, { isLoading }] = useOtpVerifyMutation()

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only allow 1 digit per box
        setOtp(newOtp);

        // Move to next input
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join(""); // OTP ko string me convert karein

        try {
            const response = await otpVerify({
                email,
                otp: enteredOtp
            }).unwrap();

            toast.success("OTP Verified Successfully");
            navigate("/login");
        } catch (error) {
            toast.error(error.message || "OTP Verification Failed. Try again.");
        }
    };

    return (
        <div className="max-w-[1200ppx] mx-auto w-[40%] mt-20 shadow-md p-5 rounded-md border-t-4 border-blue">
            <Box textAlign="center" p={3}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", marginBottom: "30px", fontSize: "24px" }}>
                    Enter OTP
                </Typography>
                <TextField
                    label="Enter Email"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Box display="flex" justifyContent="center" gap={1}>
                    {otp.map((value, index) => (
                        <TextField
                            key={index}
                            value={value}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            variant="outlined"
                            size="small"
                            sx={{
                                width: "50px",
                                textAlign: "center",
                                "& input": { textAlign: "center", fontSize: "22px" },
                            }}
                        />
                    ))}
                </Box>
                <Button
                    variant="contained"
                    sx={{ mt: 2, marginTop: '50px', width: '130px', bgcolor: "blue", color: "white", "&:hover": { bgcolor: "darkblue" } }}
                    onClick={handleVerify}
                    disabled={otp.includes("")}
                >
                    {isLoading ? <Loader /> : "Verify"}

                </Button>

            </Box>
        </div>
    );
};

export default OTPInput;
