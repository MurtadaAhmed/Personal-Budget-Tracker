import React, {useState} from "react";
import axios from "axios";

const EditTransaction = ({token, transaction, onUpdate}) => {
    const [amount, setAmount] = useState(transaction.amount);
    const [description, setDescription] = useState(transaction.description);
    const [category, setCategory] = useState(transaction.category);
    const [date, setDate] = useState(transaction.date);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.put(
              'http://localhost:5000/transactions/${transaction.id}',
              {amount, description, category, date},
              {headers: {Authorization: `Bearer ${token}`}}
          );
          onUpdate();
        } catch (error){

        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Transaction</h2>
            <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            />
            <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
            <input
            type='text'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            />
            <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            />
            <button type='submit'>Save</button>
        </form>
    );
};

export default EditTransaction;