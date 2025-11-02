// src/dashboards/SmartCVBuilderDashboard.jsx 
import React, { useState } from 'react'; 
import { Box, Paper, Typography, TextField, Button, Stepper, Step, StepLabel, CircularProgress, Stack } from '@mui/material'; 
import { askAI } from '../services/openaiService.js';

const steps = [ 'Personal Info', 'Education', 'Experience', 'Skills & Summary', 'Preview & Export' ];

export default function SmartCVBuilderDashboard() { const [activeStep, setActiveStep] = useState(0); const [loading, setLoading] = useState(false); const [resumeData, setResumeData] = useState({ name: '', title: '', contact: '', education: '', experience: '', skills: '', summary: '' });

const handleChange = (field, value) => { setResumeData({ ...resumeData, [field]: value }); };

const generateSummary = async () => { setLoading(true); try { const prompt = `You are EdupulseAI Resume Builder. Write a confident, polished, slightly witty resume summary for this person:\n Name: ${resumeData.name}\nTitle: ${resumeData.title}\nSkills: ${resumeData.skills}\nExperience: ${resumeData.experience}\nEducation: ${resumeData.education}`;
const response = await askAI(prompt); setResumeData(prev => ({ ...prev, summary: response })); } catch (err) { console.error(err); setResumeData(prev => ({ ...prev, summary: '⚠ AI had a brain freeze! Try again.' })); } finally { setLoading(false); } };

const handleNext = () => setActiveStep(prev => Math.min(prev + 1, steps.length - 1)); const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));

return ( <Box p={4}> <Typography variant="h4" color="primary" fontWeight={700} gutterBottom> 💼 Smart CV Builder </Typography>

<Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #6a0dad10, #1e90ff10)' }}>
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map(label => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>

    <Box sx={{ mt: 4 }}>
      {activeStep === 0 && (
        <Stack spacing={2}>
          <TextField label="Full Name" value={resumeData.name} onChange={e => handleChange('name', e.target.value)} />
          <TextField label="Title / Role" value={resumeData.title} onChange={e => handleChange('title', e.target.value)} />
          <TextField label="Contact Info" value={resumeData.contact} onChange={e => handleChange('contact', e.target.value)} />
        </Stack>
      )}

      {activeStep === 1 && (
        <TextField
          label="Education"
          multiline
          minRows={3}
          fullWidth
          value={resumeData.education}
          onChange={e => handleChange('education', e.target.value)}
        />
      )}

      {activeStep === 2 && (
        <TextField
          label="Experience"
          multiline
          minRows={3}
          fullWidth
          value={resumeData.experience}
          onChange={e => handleChange('experience', e.target.value)}
        />
      )}

      {activeStep === 3 && (
        <Stack spacing={2}>
          <TextField label="Skills (comma separated)" value={resumeData.skills} onChange={e => handleChange('skills', e.target.value)} />
          <Button variant="contained" color="secondary" onClick={generateSummary} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Generate Summary ✨'}
          </Button>
          {resumeData.summary && (
            <Paper sx={{ p: 2, background: '#fafafa' }}>
              <Typography variant="subtitle1">AI Summary:</Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{resumeData.summary}</Typography>
            </Paper>
          )}
        </Stack>
      )}

      {activeStep === 4 && (
        <Paper sx={{ p: 2, background: '#f0f0f5' }}>
          <Typography variant="h6" gutterBottom>Preview:</Typography>
          <Typography><strong>Name:</strong> {resumeData.name}</Typography>
          <Typography><strong>Title:</strong> {resumeData.title}</Typography>
          <Typography><strong>Contact:</strong> {resumeData.contact}</Typography>
          <Typography><strong>Education:</strong> {resumeData.education}</Typography>
          <Typography><strong>Experience:</strong> {resumeData.experience}</Typography>
          <Typography><strong>Skills:</strong> {resumeData.skills}</Typography>
          <Typography><strong>Summary:</strong> {resumeData.summary}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Download PDF (locked for paid version)
          </Button>
        </Paper>
      )}
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <Button disabled={activeStep === 0} onClick={handleBack}>
        Back
      </Button>
      <Button variant="contained" onClick={handleNext} disabled={activeStep === steps.length - 1}>
        Next
      </Button>
    </Box>
  </Paper>
</Box>

); }