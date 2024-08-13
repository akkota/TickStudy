import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Habit from './components/utils/Habit';
import Modal from '@mui/material/Modal'; 
import { GoPlusCircle } from 'react-icons/go';
import Button from './components/Button';
import { useAuth } from './components/utils/AuthContext';
import Coin from './components/Coin';

const Habits = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [habitTitle, setHabitTitle] = useState("");
    const [habits, setHabits] = useState([]);
    const { submitHabit, getHabit } = useAuth();
//TODO: Make sure streak works properly. Update last date upon check
    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const getHabitReturn = await getHabit();
                setHabits(getHabitReturn);
            } catch (error) {
                console.error('Error fetching habits:', error);
            }
        };

        fetchHabits();
    }, []);

    function handleDisplay() {
        setModalVisible(!modalVisible);
    }

    function handleInput(e) {
        setHabitTitle(e.target.value);
    }

    function handleAddHabit() {
        submitHabit(habitTitle);
        const newHabit = { habit_name: habitTitle, last_done: "2000-09-09T00:00:00", streak: 0 }
        setHabits([...habits, newHabit]); 
        setModalVisible(false);
        setHabitTitle("");
    }

    return (
        <>
            <Sidebar from="habits" />
            <Coin />
            <div className="ml-24 flex flex-col h-screen justify-center items-center">
                <div className="flex flex-row mb-12">
                    <h2 className="font-nunito text-5xl">Habits</h2>
                    <GoPlusCircle onClick={handleDisplay} className="text-3xl ml-3 mt-[12px] text-emerald-400 hover:text-emerald-600 hover:cursor-pointer" />
                </div>
                <Modal 
                    open={modalVisible}
                    onClose={handleDisplay}
                    className="flex justify-center items-center"
                    >
                    <div className="bg-black w-[500px] h-[400px] p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
                        <label className="text-white font-nunito text-xl">Enter habit title</label>
                        <input value={habitTitle} onChange={handleInput} className="block border-2 text-lg border-solid border-black bg-slate-200 h-9 w-80 text-black rounded-md mt-1 focus:ring-2 ring-blue-300 mb-12" />
                        <div>
                            <Button className="scale-90" content="Submit" onClick={handleAddHabit} />
                            <Button className="scale-90" content="Close" onClick={handleDisplay} />
                        </div>
                    </div>
                </Modal>
                <div>
                    {habits.map((habit, index) => {
                        return <Habit key={index} streak={habit.streak} date={habit.last_done} habit_name={habit.habit_name} />
                    })}
                </div>
            </div>
            
        </>
    );
}

export default Habits;