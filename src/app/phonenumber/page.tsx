"use client";
import { useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "../lib/firebase-config"; // Adjusted for alias

const PhoneAuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError(null);

    // Validate phone number format (starting with '+' and 10-15 digits)
    const phonePattern = /^\+(\d{10,15})$/;
    if (!phonePattern.test(phone)) {
      setError("Please enter a valid phone number (e.g. +1234567890).");
      setIsLoading(false);
      return;
    }

    try {
      // Initialize RecaptchaVerifier if it doesn't exist yet
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        callback: (response:any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        expiredCallback: () => {
          // Response expired. Ask user to solve reCAPTCHA again.
        }
      });

      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setResendCountdown(30); // Reset countdown for resend
      alert("OTP sent successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError("Failed to send OTP: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!confirmationResult) {
        throw new Error("No OTP confirmation available. Please resend the OTP.");
      }

      const userCredential = await confirmationResult.confirm(otp);
      console.log("User authenticated:", userCredential.user);

      alert("Phone number verified successfully!");
      // Optionally reset OTP and phone fields
      setPhone("");
      setOtp("");
      setOtpSent(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError("Failed to verify OTP: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Phone Number Authentication</h2>

      {!otpSent ? (
        <>
          <input
            type="text"
            placeholder="Enter phone number (+1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleSendOTP} disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
          {resendCountdown > 0 ? (
            <p>Resend OTP in {resendCountdown} seconds</p>
          ) : (
            <button onClick={handleSendOTP}>Resend OTP</button>
          )}
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuthPage;
