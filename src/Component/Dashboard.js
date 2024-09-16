import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Dashboard() {
    const [data1, setData1] = useState([]);
    const [to, setTo] = useState({});
    const [userData, setUserData] = useState(null); // Initialize as null

    const { userId } = useParams();

    useEffect(() => {
        
        axios.get(`http://localhost:3000/users/${userId}`)
            .then((res) => setUserData(res.data))
            .catch((err) => console.error(err));

        
        const storedData = JSON.parse(localStorage.getItem('todoList')) || [];
        setData1(storedData);
    }, [userId]);

    useEffect(() => {
        
        localStorage.setItem('todoList', JSON.stringify(data1));
    }, [data1]);

    const deleteData = (id) => {
        const newData = data1.filter(v => v.id !== id);
        setData1(newData);
    };

    const getValue = (e) => {
        const { name, value } = e.target;
        setTo({ ...to, [name]: value });
    };

    const Tododata = (e) => {
        e.preventDefault();
        const obj = {
            task: e.target.task.value,
            date: e.target.date.value,
            category: e.target.category.value,
            id: Math.round(Math.random() * 1000)
        };
        setData1([...data1, obj]);
        axios.post("http://localhost:3000/todo/", to)
            .then(() => {
                console.log("Task added successfully");
            });
        e.target.reset();
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Personal': return "#4CAF50";
            case 'Office': return "#9E9E9E"; 
            case 'Family': return "#F44336"; 
            case 'Other': return "#FF9800";
            default: return "#2196F3"; 
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div>
                
                {userData ? (
                    <h1>Welcome to your dashboard, {userData.name}!</h1>
                ) : (
                    <h1>Loading your dashboard...</h1>
                )}
            </div>

            <h1 style={{ textAlign: 'center', color: '#333' }}>Task Manage</h1>

            <form method="post" onSubmit={Tododata} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', borderRadius: '10px', backgroundColor: '#e3f2fd', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <table border={1} cellPadding="10px" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <td>Enter Your Task Details:</td>
                            <td><textarea name="task" style={{ width: '100%', height: '60px', borderRadius: '5px', border: '1px solid #ddd' }} onChange={getValue} /></td>
                        </tr>
                        <tr>
                            <td>Categories Task:</td>
                            <td>
                                <select name="category" style={{ width: '100%', height: '35px', borderRadius: '5px', border: '1px solid #ddd' }} onChange={getValue}>
                                    <option value="Personal">Personal Task</option>
                                    <option value="Office">Office Task</option>
                                    <option value="Family">Family Task</option>
                                    <option value="Other">Other Task</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Enter Task Date:</td>
                            <td><input type="date" name="date" style={{ width: '100%', height: '35px', borderRadius: '5px', border: '1px solid #ddd' }} onChange={getValue} /></td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: 'center' }}>
                                <input type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                {data1.map((v, i) => (
                    <div key={i} style={{ backgroundColor: getCategoryColor(v.category), padding: '20px', borderRadius: '10px', width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 style={{ margin: 0 }}>Date: {v.date}</h5>
                            <button onClick={() => deleteData(v.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>❌</button>
                        </div>
                        <h2 style={{ margin: '10px 0', fontSize: '20px' }}>{v.category} Task:</h2>
                        <h5>{v.task}</h5>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
