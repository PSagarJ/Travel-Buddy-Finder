import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BudgetSplitter = () => {
  const { id } = useParams(); // 💥 Grab the unique Trip ID from the URL parameter
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form input states
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [expenses, setExpenses] = useState([]); // Temporary local array until backend storage is active

  // Get current user session info
  const loggedInUser = localStorage.getItem('user');
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        // Fetch the real trip document from MongoDB
        const response = await axios.get(`http://localhost:5000/api/trips/${id}`);
        setTrip(response.data);
        
        // Default the "Who paid" dropdown to the logged-in user if they are part of the crew
        if (currentUser) {
          setPaidBy(currentUser.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading ledger details:", error.message);
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  // Handle adding an expense locally for testing the UI rendering
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !paidBy) return alert("Please fill out all fields!");

    // Find the name of the person who paid from our dropdown values
    let payerName = "Unknown Crew Member";
    if (paidBy === trip?.creatorId) {
      payerName = "Creator (You)";
    } else {
      const foundMember = trip?.approvedMembers?.find(m => m.userId === paidBy || m._id === paidBy);
      if (foundMember) payerName = foundMember.name;
    }

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      payerName,
      paidBy
    };

    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
  };

// 🧮 Calculations based on real dynamic inputs
  const totalCost = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalCrewCount = (trip?.approvedMembers?.length || 0) + 1; // Crew + Creator
  const perPersonShare = totalCrewCount > 0 ? totalCost / totalCrewCount : 0;

  // 🧠 THE SETTLEMENT ENGINE ALGORITHM
  const calculateSettlements = () => {
    if (expenses.length === 0) return [];

    const balances = {};
    const namesMap = { [trip.creatorId]: 'Creator (You)' };

    // Initialize all participant groups with 0 spent balance
    balances[trip.creatorId] = 0;
    trip.approvedMembers?.forEach(m => {
      balances[m.userId] = 0;
      namesMap[m.userId] = m.name;
    });

    // Sum up total money spent by each unique individual id
    expenses.forEach(exp => {
      if (balances[exp.paidBy] !== undefined) {
        balances[exp.paidBy] += exp.amount;
      }
    });

    // Compute net balance change vectors (Paid amount minus fair share)
    const netBalances = Object.keys(balances).map(id => ({
      id,
      name: namesMap[id] || 'Explorer',
      net: balances[id] - perPersonShare
    }));

    // Split members into debtors (owe money) and creditors (get back money)
    let debtors = netBalances.filter(x => x.net < 0).map(x => ({ ...x, net: Math.abs(x.net) }));
    let creditors = netBalances.filter(x => x.net > 0);

    const steps = [];
    let d = 0, c = 0;

    // Match debts to payouts sequentially
    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const actualOwed = Math.min(debtor.net, creditor.net);

      if (actualOwed > 0.01) {
        steps.push({
          from: debtor.name,
          to: creditor.name,
          amount: actualOwed
        });
      }

      debtor.net -= actualOwed;
      creditor.net -= actualOwed;

      if (debtor.net <= 0.01) d++;
      if (creditor.net <= 0.01) c++;
    }

    return steps;
  };

  const settlementsList = calculateSettlements();

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '4rem', color: '#666' }}>Loading Ledger...</h2>;
  if (!trip) return <h2 style={{ textAlign: 'center', marginTop: '4rem', color: '#ef4444' }}>Trip not found!</h2>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      
      <Link to="/dashboard" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Dashboard
      </Link>

      {/* Main Banner Header */}
      <div style={{ background: '#0f172a', color: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.2rem' }}>Trip Ledger</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '1.1rem' }}>🌐 Real-time Expenses for: <strong>{trip.title}</strong></p>
      </div>

      {/* Numerical Metric Summary Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Trip Cost</span>
          <h2 style={{ fontSize: '2.5rem', color: '#10b981', margin: '0.5rem 0 0 0' }}>₹{totalCost.toFixed(2)}</h2>
        </div>
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Per Person Share ({totalCrewCount} Way Split)</span>
          <h2 style={{ fontSize: '2.5rem', color: '#f59e0b', margin: '0.5rem 0 0 0' }}>₹{perPersonShare.toFixed(2)}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* ADD EXPENSE COMPONENT CONTAINER */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>Add Expense</h3>
          
          <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" placeholder="What did you buy? (e.g., Dinner, Train Tickets)" required
              value={description} onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
            
            <input 
              type="number" placeholder="How much? (₹)" required
              value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />

            {/* 💥 DYNAMIC POPULATION DROPDOWN SELECTOR */}
            <select 
              value={paidBy} onChange={(e) => setPaidBy(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}
            >
              <option value="" disabled>Who paid?</option>
              
              {/* Always include the Trip Creator option */}
              <option value={trip.creatorId}>Creator Account</option>
              
              {/* Map out only the real, approved members saved inside MongoDB document */}
              {trip.approvedMembers?.map(member => (
                <option key={member.userId || member._id} value={member.userId || member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
              Log Expense
            </button>
          </form>
        </div>

{/* SETTLEMENT ENGINE STATUS */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>How to Settle Up</h3>
          
          {settlementsList.length === 0 ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '12px', color: '#166534', fontWeight: 'bold', textAlign: 'center' }}>
              🎉 Everyone is perfectly settled up!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {settlementsList.map((step, idx) => (
                <div key={idx} style={{ 
                  background: '#fff7ed', 
                  border: '1px solid #ffedd5', 
                  padding: '1rem', 
                  borderRadius: '10px', 
                  color: '#c2410c',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                }}>
                  <span style={{ fontSize: '0.95rem' }}>
                    <strong>{step.from}</strong> pays <strong>{step.to}</strong>
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ea580c' }}>
                    ₹{step.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* TRANSACTION LOG HISTORY FOOTER LIST */}
      <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
        <h3 style={{ color: '#1e293b' }}>Recent Transactions</h3>
        {expenses.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No expenses logged yet for this trip itinerary.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            {expenses.map(exp => (
              <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div>
                  <strong style={{ color: '#1e293b', display: 'block' }}>{exp.description}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Paid by: {exp.payerName}</span>
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>₹{exp.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BudgetSplitter;