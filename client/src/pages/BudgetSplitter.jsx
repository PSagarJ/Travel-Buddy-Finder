import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BudgetSplitter = () => {
// Grab the exact trip ID from the URL!
  const { tripId } = useParams(); 
  const members = ['Pratap', 'Amit', 'Sneha'];

  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: members[0] });
  const [loading, setLoading] = useState(true);

  // 1. Fetch real expenses from MongoDB on load
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/expenses/${tripId}`);
        setExpenses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [tripId]);

  // 2. Save new expense directly to MongoDB
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;
    
    try {
      const response = await axios.post(`http://localhost:5000/api/expenses/${tripId}`, {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy
      });

      // Add the newly saved database object to our screen
      setExpenses([...expenses, response.data]);
      setNewExpense({ description: '', amount: '', paidBy: members[0] }); 
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense to database.");
    }
  };

  // --- THE SETTLEMENT ALGORITHM ---
  const calculateDebts = () => {
    const balances = {};
    members.forEach(m => balances[m] = 0);

    let totalSpent = 0;

    expenses.forEach(exp => {
      // Only calculate if the member still exists in the trip
      if (balances[exp.paidBy] !== undefined) {
        balances[exp.paidBy] += exp.amount;
        totalSpent += exp.amount;
      }
    });

    const splitAmount = totalSpent / members.length;
    members.forEach(m => balances[m] -= splitAmount);

    const debtors = members.filter(m => balances[m] < -0.01).sort((a, b) => balances[a] - balances[b]);
    const creditors = members.filter(m => balances[m] > 0.01).sort((a, b) => balances[b] - balances[a]);

    const settlements = [];
    let d = 0; 
    let c = 0; 

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const amountToSettle = Math.min(Math.abs(balances[debtor]), balances[creditor]);
      
      settlements.push({ from: debtor, to: creditor, amount: amountToSettle.toFixed(2) });
      
      balances[debtor] += amountToSettle;
      balances[creditor] -= amountToSettle;

      if (Math.abs(balances[debtor]) < 0.01) d++;
      if (balances[creditor] < 0.01) c++;
    }

    return { totalSpent, splitAmount, settlements };
  };

  const { totalSpent, splitAmount, settlements } = calculateDebts();
  // --------------------------------

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '4rem', color: '#666' }}>Loading Ledger...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <Link to="/dashboard" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Dashboard
      </Link>

      <div style={{ background: '#0f172a', color: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>Trip Ledger</h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>Himalayas Expedition</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Total Trip Cost</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>${totalSpent.toFixed(2)}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', textTransform: 'uppercase' }}>Per Person Share</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.5rem' }}>${splitAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        
        <div>
          <h3 style={{ color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Add Expense</h3>
          <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <input type="text" placeholder="What did you buy?" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <input type="number" placeholder="How much? ($)" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <select value={newExpense.paidBy} onChange={e => setNewExpense({...newExpense, paidBy: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
              {members.map(m => <option key={m} value={m}>{m} paid</option>)}
            </select>
            <button type="submit" style={{ padding: '0.75rem', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Log Expense</button>
          </form>

          <h3 style={{ color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginTop: '2rem' }}>Recent Transactions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {expenses.length === 0 && <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No expenses logged yet.</p>}
            {expenses.map(exp => (
              <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{exp.description}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Paid by {exp.paidBy}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#ef4444' }}>${exp.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>How to Settle Up</h3>
          {settlements.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontWeight: 'bold' }}>
              Everyone is perfectly settled up! 🎉
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {settlements.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '1.1rem' }}>{s.from}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    <span>owes</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.2rem', margin: '0.25rem 0' }}>${s.amount}</span>
                    <span>to</span>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#0284c7', fontSize: '1.1rem' }}>{s.to}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BudgetSplitter;