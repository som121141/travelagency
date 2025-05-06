import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { fetchPackages } from '../store/slices/packageSlice';
import { fetchBookings } from '../store/slices/bookingSlice';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { packages } = useSelector((state) => state.packages);
  const { bookings } = useSelector((state) => state.bookings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchBookings());
  }, [dispatch]);

  const renderClientDashboard = () => (
    <div className="text-black">
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Bookings
            </Typography>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{booking.package.title}</Typography>
                    <Typography color="textSecondary">
                      Status: {booking.status}
                    </Typography>
                    <Typography color="textSecondary">
                      Payment: {booking.paymentStatus}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No bookings found.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Packages
            </Typography>
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <Card key={pkg._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{pkg.title}</Typography>
                    <Typography color="textSecondary">
                      Destination: {pkg.destination}
                    </Typography>
                    <Typography color="textSecondary">
                      Price: ${pkg.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/bookings/create/${pkg._id}`)}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>No packages available.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );

  const renderAgencyDashboard = () => (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Packages
            </Typography>
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <Card key={pkg._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{pkg.title}</Typography>
                    <Typography color="textSecondary">
                      Destination: {pkg.destination}
                    </Typography>
                    <Typography color="textSecondary">
                      Price: ${pkg.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>No packages created yet.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{booking.package.title}</Typography>
                    <Typography color="textSecondary">
                      Client: {booking.client.name}
                    </Typography>
                    <Typography color="textSecondary">
                      Status: {booking.status}
                    </Typography>
                    <Typography color="textSecondary">
                      Payment: {booking.paymentStatus}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Update Status
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>No bookings found.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              All Packages
            </Typography>
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <Card key={pkg._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{pkg.title}</Typography>
                    <Typography color="textSecondary">
                      Agency: {pkg.agency.name}
                    </Typography>
                    <Typography color="textSecondary">
                      Destination: {pkg.destination}
                    </Typography>
                    <Typography color="textSecondary">
                      Price: ${pkg.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>No packages available.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              All Bookings
            </Typography>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{booking.package.title}</Typography>
                    <Typography color="textSecondary">
                      Client: {booking.client.name}
                    </Typography>
                    <Typography color="textSecondary">
                      Agency: {booking.agency.name}
                    </Typography>
                    <Typography color="textSecondary">
                      Status: {booking.status}
                    </Typography>
                    <Typography color="textSecondary">
                      Payment: {booking.paymentStatus}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Update Status
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography>No bookings found.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ flexGrow: 1 }}>
        {user?.role === 'client' && renderClientDashboard()}
        {user?.role === 'agency' && renderAgencyDashboard()}
        {user?.role === 'admin' && renderAdminDashboard()}
      </Box>
    </Container>
  );
}

export default Dashboard; 