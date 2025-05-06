import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Alert,
  Divider,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    try {
      // TODO: Implement profile update logic
      // await dispatch(updateProfile(formData));
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
            }}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h4" component="h1">
              {user?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true} // Email cannot be changed
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                multiline
                rows={2}
              />
            </Grid>

            {isEditing && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Change Password
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile; 