import React, { useEffect, useState } from 'react';
import { Box, Stack, TextField, Slider, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Container, Link } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import GitHubIcon from '@mui/icons-material/GitHub';
import expImage from './exp.png';
import solImage from './sol.png';
import solPieceImage from './sol-piece.png';
import auroraImage from './aurora.png';

const PROBABILITY = [
  {},
  { success: 1, fail: 0, down: 0, run: 0 },
  { success: 0.6, fail: 0.4, down: 0, run: 0 },
  { success: 0.5, fail: 0, down: 0.5, run: 0 },
  { success: 0.4, fail: 0, down: 0.6, run: 0 },
  { success: 0.307, fail: 0, down: 0.693, run: 0 },
  { success: 0.205, fail: 0, down: 0.765, run: 0.03 },
  { success: 0.103, fail: 0, down: 0.857, run: 0.04 },
  { success: 0.05, fail: 0, down: 0.9, run: 0.05 },
];
const REWARD = [0, 0, 1, 3, 6, 10, 15, 50, 150, 300];
const MAX_STAGE = 100;

const calculateProbability = (
  currentFeedCount = 0,
  currentLevel = 1,
  targetLevel = 9,
) => {
  let probs = Array(10).fill(0);
  probs[currentLevel] = 1;

  for (let stage = currentFeedCount; stage < MAX_STAGE; stage++) {
    const newProbs = Array(10).fill(0);
    newProbs[0] = probs[0];
    newProbs[targetLevel] = probs[targetLevel];

    for (let lev = 1; lev < targetLevel; lev++) {
      newProbs[lev + 1] += probs[lev] * PROBABILITY[lev].success;
      newProbs[lev] += probs[lev] * PROBABILITY[lev].fail;
      newProbs[lev - 1] += probs[lev] * PROBABILITY[lev].down;
      newProbs[0] += probs[lev] * PROBABILITY[lev].run;
    }

    probs = newProbs;
  }

  return probs;
};

const calculateReward = (probs) => {
  let total = 0;
  probs.forEach((p, i) => {
    total += p * REWARD[i];
  });
  return total;
};

const ProbabilityUI = () => {
  const [feedCount, setFeedCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(7);
  const [probabilityData, setProbabilityData] = useState([
    { name: '파괴확률', value: 0 },
    { name: 'Lv2', value: 0 },
    { name: 'Lv3', value: 0 },
    { name: 'Lv4', value: 0 },
    { name: 'Lv5', value: 0 },
    { name: 'Lv6', value: 0 },
    { name: 'Lv7', value: 0 },
    { name: 'Lv8', value: 0 },
    { name: 'Lv9', value: 0 },
  ]);
  const [reward, setReward] = useState(0);

  useEffect(() => {
    const probs = calculateProbability(feedCount, level, targetLevel);
    console.log('feedCount', feedCount);
    console.log('level', level);
    console.log('targetLevel', targetLevel);
    console.log('probs', probs);
    setProbabilityData([
      { name: '파괴확률', value: probs[0]*100 },
      { name: 'Lv2', value: probs[2]*100 },
      { name: 'Lv3', value: probs[3]*100 },
      { name: 'Lv4', value: probs[4]*100 },
      { name: 'Lv5', value: probs[5]*100 },
      { name: 'Lv6', value: probs[6]*100 },
      { name: 'Lv7', value: probs[7]*100 },
      { name: 'Lv8', value: probs[8]*100 },
      { name: 'Lv9', value: probs[9]*100 },
    ]);

    setReward(calculateReward(probs));
  }, [feedCount, level, targetLevel]);

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
      <Typography variant="h3" gutterBottom align="center" mt={4} mb={8}>황금 문어 확률 계산기</Typography>

      <Stack direction="row" spacing={4} mb={4}>
        <Stack flex={1}>
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

        <Stack flex={1}>
          <TextField
            label="레벨"
            type="number"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            inputProps={{ min: 1, max: 9 }}
          />
        </Stack>

        <Stack flex={1}>
          <TextField
            label="목표 레벨"
            type="number"
            value={targetLevel}
            onChange={(e) => setTargetLevel(Number(e.target.value))}
            inputProps={{ min: 2, max: 9 }}
          />
        </Stack>

      </Stack>

      <Stack spacing={2} justifyContent="center" direction="row" mb={4}>
        <Button variant="contained" onClick={handleSuccess} disabled={level === 9 || feedCount === 100}>먹이주기 (성공)</Button>
        <Button variant="contained" color="secondary" onClick={handleFailure} disabled={level === 1 || feedCount === 100}>먹이주기 (실패)</Button>
        <Button variant="contained" color="error" onClick={handleReset} disabled={feedCount === 0 && level === 1}>탈출 (초기화)</Button>
      </Stack>

      <Typography variant="h6">목표 레벨 {targetLevel}에 대한 레벨별 확률 분포</Typography>

      <Stack direction="row" spacing={4}>
        <Box width="50%">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><img src={expImage} alt="상급 EXP 교환권" style={{ width: '32px', height: '32px' }} /></TableCell>
                  <TableCell align="center"><img src={solImage} alt="희미한 솔 에르다의 기운" style={{ width: '32px', height: '32px' }} /></TableCell>
                  <TableCell align="center"><img src={solPieceImage} alt="솔 에르다 조각 교환권" style={{ width: '32px', height: '32px' }} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{(reward * 20).toFixed(1)}개</TableCell>
                  <TableCell align="center">{(reward * 4).toFixed(1)}개</TableCell>
                  <TableCell align="center">{reward.toFixed(1)}개</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

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
                    <TableCell>{row.value.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} m={4}>
        <Typography variant="body2" color="textSecondary" align="center">
          Created by MovieJo (<img src={auroraImage} alt="오로라" style={{ width: '14px', height: '14px' }} /> MovieJo101) |
        </Typography>
        <Link href="https://github.com/MovieJo" target="_blank">
          <GitHubIcon fontSize="small" />
        </Link>
      </Stack>
    </Container>
  );
};

export default ProbabilityUI;
