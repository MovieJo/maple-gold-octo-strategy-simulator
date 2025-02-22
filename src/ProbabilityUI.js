import React, { useState } from 'react';
import { Box, Stack, TextField, Slider, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Container } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const ProbabilityUI = () => {
  const [feedCount, setFeedCount] = useState(0);
  const [level, setLevel] = useState(1);
  const probabilityData = [
    { name: '파괴확률', value: 20 },
    { name: 'Lv2', value: 15 },
    { name: 'Lv3', value: 10 },
    { name: 'Lv4', value: 10 },
    { name: 'Lv5', value: 15 },
    { name: 'Lv6', value: 10 },
    { name: 'Lv7', value: 10 },
    { name: 'Lv8', value: 5 },
    { name: 'Lv9', value: 5 },
  ];

  const handleSuccess = () => {
    setFeedCount(feedCount + 1);
    setLevel(prev => (prev < 9 ? prev + 1 : prev));
  };

  const handleFailure = () => {
    setFeedCount(feedCount + 1);
    setLevel(prev => (prev > 2 ? prev - 1 : prev));
  };

  const handleReset = () => {
    setFeedCount(0);
    setLevel(1);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom align="center">황금 문어 확률 계산기</Typography>

      <Stack direction="row" spacing={4} mb={4}>
        <Stack width="50%">
          <TextField
            label="먹이를 준 횟수"
            type="number"
            value={feedCount}
            onChange={(e) => setFeedCount(Number(e.target.value))}
            inputProps={{ min: 0, max: 100 }}
          />
          <Slider
            value={feedCount}
            onChange={(e, newValue) => setFeedCount(newValue)}
            aria-labelledby="feed-slider"
            min={0}
            max={100}
          />
        </Stack>

        <Stack width="50%">
          <TextField
            label="레벨"
            type="number"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            inputProps={{ min: 1, max: 9 }}
          />
        </Stack>

      </Stack>

      <Stack spacing={2} justifyContent="center" direction="row">
        <Button variant="contained" onClick={handleSuccess} disabled={level === 9 || feedCount === 100}>먹이주기 (성공)</Button>
        <Button variant="contained" color="secondary" onClick={handleFailure} disabled={level === 1 || feedCount === 100}>먹이주기 (실패)</Button>
        <Button variant="contained" color="error" onClick={handleReset} disabled={feedCount === 0 && level === 1}>탈출 (초기화)</Button>
      </Stack>

      <Stack direction="row" spacing={4}>
        <Box width="50%">
          <Typography variant="h6">확률 분포 그래프</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={probabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box width="50%">
          <Typography variant="h6">확률 테이블</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>레벨</TableCell>
                  <TableCell>확률 (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {probabilityData.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </Container>
  );
};

export default ProbabilityUI;
