import React from 'react';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';

export const DashboardSkeleton = () => (
  <Box p={3}>
    <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export const CardSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="70%" height={28} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
      <Box display="flex" gap={1}>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="40%" />
      </Box>
    </CardContent>
  </Card>
);

export const ListSkeleton = ({ count = 5 }) => (
  <Box>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} display="flex" alignItems="center" p={2} mb={1}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box flex={1}>
          <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
        <Skeleton variant="rectangular" width={80} height={36} />
      </Box>
    ))}
  </Box>
);

export const FormSkeleton = () => (
  <Box p={3}>
    <Skeleton variant="text" width="50%" height={36} sx={{ mb: 3 }} />
    <Box mb={3}>
      <Skeleton variant="text" width="20%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" height={56} />
    </Box>
    <Box mb={3}>
      <Skeleton variant="text" width="25%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" height={56} />
    </Box>
    <Box mb={3}>
      <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" height={120} />
    </Box>
    <Box display="flex" gap={2}>
      <Skeleton variant="rectangular" width={100} height={40} />
      <Skeleton variant="rectangular" width={100} height={40} />
    </Box>
  </Box>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Box>
    {/* Table Header */}
    <Box display="flex" p={2} borderBottom="1px solid" borderColor="divider">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant="text" width="20%" height={20} sx={{ mr: 2 }} />
      ))}
    </Box>
    {/* Table Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box key={rowIndex} display="flex" p={2} borderBottom="1px solid" borderColor="divider">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" width="20%" height={16} sx={{ mr: 2 }} />
        ))}
      </Box>
    ))}
  </Box>
);

export default {
  DashboardSkeleton,
  CardSkeleton,
  ListSkeleton,
  FormSkeleton,
  TableSkeleton
};