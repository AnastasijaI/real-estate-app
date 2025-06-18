import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Rating,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
} from "@mui/material";

const AppSurvey = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const [form, setForm] = useState({
    likesMost: "",
    improvements: "",
    wouldRecommend: false,
    rating: 0,
    easeOfUse: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    const payload = {
      userId: user.userId,
      likesMost: form.likesMost,
      improvements: form.improvements,
      wouldRecommend: form.wouldRecommend,
      submittedAt: new Date().toISOString(),
      rating: form.rating,
      easeOfUse: form.easeOfUse,
    };

    try {
      const response = await fetch("https://localhost:7026/api/appsurveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Thank you for your feedback!");
        setForm({
          likesMost: "",
          improvements: "",
          wouldRecommend: false,
          rating: 0, 
          easeOfUse: "",
        });
      } else {
        alert("Failed to submit survey.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f5f5f5" }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <img src="/logo2_transparent.png" alt="LiveIn Logo" style={{ width: 100, marginBottom: 8 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            LiveIn App Feedback
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Help us improve the experience by answering just a few questions.
          </Typography>
        </Box>

        <Typography sx={{ mt: 2, mb: 1 }}>
          How would you rate the LiveIn application?
        </Typography>
        <Rating
          name="rating"
          value={form.rating}
          precision={0.5}
          onChange={(event, newValue) =>
            setForm((prev) => ({ ...prev, rating: newValue }))
          }
        />

        <TextField
          label="What do you like the most?"
          name="likesMost"
          value={form.likesMost}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 3 }}
        />

        <TextField
          label="What would you improve?"
          name="improvements"
          value={form.improvements}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 3 }}
        />

        <FormControl sx={{ mt: 3 }}>
          <FormLabel>Was the app easy to use?</FormLabel>
          <RadioGroup
            name="easeOfUse"
            value={form.easeOfUse}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="Very Easy" control={<Radio />} label="Very Easy" />
            <FormControlLabel value="Okay" control={<Radio />} label="Okay" />
            <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
          </RadioGroup>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={form.wouldRecommend}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  wouldRecommend: e.target.checked,
                }))
              }
            />
          }
          label="I would recommend this app to a friend"
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Submit Feedback
        </Button>
      </Paper>
    </Box>
  );
};

export default AppSurvey;
