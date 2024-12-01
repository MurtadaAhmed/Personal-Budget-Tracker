import React, {useEffect, useState} from "react";
import axios from 'axios';

const TransactionList = ({token, onEdit, onDelete}) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/transactions',
                    {headers: {Authorization: `Bearer ${token}`},}
                )
                setTransactions(response.data)
        } catch (error){
            console.log('Error fetching transactions: ' , error)}
        };
        fetchTransactions()
        }, [token]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/transactions/${id}`,
                {headers: {Authorization: `Bearer ${token}`}}
            )
            setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
        } catch (error) {

        }
    }


    return(
        <div>
            <h2>Your Transactions</h2>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.date} - {transaction.category} - {transaction.amount}
                        <button onClick={() => onEdit(transaction)}>Edit</button>
                        <button onClick={() => handleDelete(transaction.id)}></button>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default TransactionList;