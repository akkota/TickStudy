import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { useAuth } from './components/utils/AuthContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Leaderboard = (props) => {
  const { getLeaderboardData, userID } = useAuth();
  const [leaderboardItems, setLeaderboardItems] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const leaderboardData = await getLeaderboardData();
        console.log(leaderboardData.user_id);
        console.log(userID)
        setLeaderboardItems(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };
  
    fetchLeaderboardData();
  }, []);

  return (
    <div>
      <Sidebar from="leaderboard" />
      <div className="ml-16 h-screen flex items-center justify-center">
        <TableContainer className="rounded-lg bg-slate-500 w-4/5" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-nunito text-xl' align="center"> Rank </TableCell> 
                <TableCell className='font-nunito text-xl' align="center"> UserID </TableCell>
                <TableCell className='font-nunito text-xl' align="center"> Total Study Hours </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardItems.map((item, index) => (
                <TableRow key={item.user_id}>
                  <TableCell className='font-nunito text-lg' align="center"> { index + 1 } </TableCell>
                  <TableCell 
                    className={`font-nunito text-lg ${userID === item.user_id ? 'text-yellow-600' : ''}`} 
                    align="center">
                    {item.user_id}
                  </TableCell>
                  <TableCell className='font-nunito text-lg' align="center"> {(item.total_study_time / (60 * 60)).toFixed(2)} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Leaderboard;