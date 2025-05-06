import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  MenuItem,
} from '@mui/material';
import { register } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const roles = [
  { value: 'client', label: 'Client' },
  { value: 'agency', label: 'Travel Agency' },
];

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    phone: '',
    address: '',
  });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await dispatch(register(formData)).unwrap();
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            name="role"
            label="Role"
            value={formData.role}
            onChange={handleChange}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            fullWidth
            name="phone"
            label="Phone Number"
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="address"
            label="Address"
            id="address"
            multiline
            rows={2}
            value={formData.address}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {'Already have an account? Sign in'}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Register; 