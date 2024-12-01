import React, {useState} from "react";
import axios from "axios";

const AddTransaction = ({token, onAdd}) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/transactions',
                {amount: parseFloat(amount), description, category, date},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            onAdd(response.data)
            setAmount('');
            setDescription('');
            setCategory('');
            setDate('');

        } catch (error){
            console.log('Error adding transaction: ', error)
            console.log(amount, description, category, date)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Transaction</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
            />
            <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            />
            <input
            type='text'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder='Category'
            />
            <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder='Date'
            required
            />
            <button type='submit'>Add</button>
        </form>
    )
}

export default AddTransaction;