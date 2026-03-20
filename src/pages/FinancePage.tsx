import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Target, Trash2, X, BarChart3, Heart, Pencil } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface Transaction {
  id: string;
  name: string;
  value: number;
  color: string;
  type: 'income' | 'expense';
  date: string;
}

interface Dream {
  id: string;
  name: string;
  targetDate: string;
  targetValue: number;
  currentValue: number;
}

const INITIAL_TRANSACTIONS: Transaction[] = [];

const INITIAL_DREAMS: Dream[] = [
  { id: '1', name: 'Viagem para Paris', targetDate: 'Junho 2025', targetValue: 9000, currentValue: 4050 },
];

export default function FinancePage() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (!user) return INITIAL_TRANSACTIONS;
    const saved = localStorage.getItem(`finance_transactions_${user.id}`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [dreams, setDreams] = useState<Dream[]>(() => {
    if (!user) return INITIAL_DREAMS;
    const saved = localStorage.getItem(`finance_dreams_${user.id}`);
    return saved ? JSON.parse(saved) : INITIAL_DREAMS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`finance_transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`finance_dreams_${user.id}`, JSON.stringify(dreams));
    }
  }, [dreams, user]);
  
  // Transaction Modal State
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<'expense' | 'income'>('expense');

  // Dream Modal State
  const [isAddingDream, setIsAddingDream] = useState(false);
  const [dreamName, setDreamName] = useState('');
  const [dreamTarget, setDreamTarget] = useState('');
  const [dreamDate, setDreamDate] = useState('');
  const [dreamCurrent, setDreamCurrent] = useState('');

  const [dreamToRemove, setDreamToRemove] = useState<string | null>(null);
  const [transactionToRemove, setTransactionToRemove] = useState<string | null>(null);
  const [isClearingAllDreams, setIsClearingAllDreams] = useState(false);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);

  const totals = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);

    const data = [];
    if (income > 0) data.push({ name: 'Entradas', value: income, color: '#22c55e' });
    if (expense > 0) data.push({ name: 'Saídas', value: expense, color: '#ef4444' });
    
    return data;
  }, [transactions]);

  const monthlyHistory = useMemo(() => {
    const hasExpenses = transactions.some(t => t.type === 'expense');
    if (!hasExpenses) return [];
    return [
      { month: new Date().toLocaleDateString('pt-BR', { month: 'short' }), entrada: totals.income, saida: totals.expense }
    ];
  }, [totals, transactions]);

  const handleAddTransaction = () => {
    if (!newName || !newValue) return;
    const val = newValue.replace(',', '.');
    const parsedValue = parseFloat(val);
    if (isNaN(parsedValue)) return;

    const color = newType === 'income' ? '#22c55e' : '#ef4444';
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name: newName,
      value: parsedValue,
      color: color,
      type: newType,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setTransactions(prev => [...prev, newTransaction]);
    setNewName('');
    setNewValue('');
    setIsAddingTransaction(false);
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddDream = () => {
    if (!dreamName || !dreamTarget || !dreamDate) return;
    const val = dreamTarget.replace(',', '.');
    const currentVal = dreamCurrent.replace(',', '.');
    const parsedTarget = parseFloat(val);
    const parsedCurrent = parseFloat(currentVal) || 0;
    
    if (isNaN(parsedTarget)) return;

    const newDream: Dream = {
      id: Date.now().toString(),
      name: dreamName,
      targetDate: dreamDate,
      targetValue: parsedTarget,
      currentValue: parsedCurrent,
    };
    setDreams(prev => [...prev, newDream]);
    setDreamName('');
    setDreamTarget('');
    setDreamDate('');
    setDreamCurrent('');
    setIsAddingDream(false);
  };

  const handleRemoveDream = (id: string) => {
    setDreams(prev => prev.filter(d => d.id !== id));
  };

  const handleEditDream = () => {
    if (!editingDream || !dreamName || !dreamTarget || !dreamDate) return;
    const val = dreamTarget.replace(',', '.');
    const currentVal = dreamCurrent.replace(',', '.');
    const parsedTarget = parseFloat(val);
    const parsedCurrent = parseFloat(currentVal) || 0;
    
    if (isNaN(parsedTarget)) return;

    setDreams(prev => prev.map(d => d.id === editingDream.id ? {
      ...d,
      name: dreamName,
      targetDate: dreamDate,
      targetValue: parsedTarget,
      currentValue: parsedCurrent,
    } : d));
    
    setDreamName('');
    setDreamTarget('');
    setDreamDate('');
    setDreamCurrent('');
    setEditingDream(null);
  };

  const openEditModal = (dream: Dream) => {
    setEditingDream(dream);
    setDreamName(dream.name);
    setDreamTarget(dream.targetValue.toString());
    setDreamDate(dream.targetDate);
    setDreamCurrent(dream.currentValue.toString());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 space-y-8"
    >
      <section className="primary-gradient p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white editorial-shadow relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-rose-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Saldo Conjunto</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">R$ {totals.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          <div className="flex flex-wrap gap-2 sm:gap-4 pt-4">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-full">
              <ArrowUpRight size={14} />
              <span>R$ {totals.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-full">
              <ArrowDownLeft size={14} />
              <span>R$ {totals.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        <Wallet className="absolute -right-4 -bottom-4 text-white/10 w-24 h-24 sm:w-32 sm:h-32 rotate-12" />
      </section>

      {/* Monthly Evolution Chart */}
      <section className="glass-card p-6 rounded-3xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-xl font-bold text-zinc-800">Evolução Mensal</h3>
          <BarChart3 className="text-rose-300" size={20} />
        </div>
        <div className="h-48 w-full flex items-center justify-center">
          {monthlyHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#fff8f8' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="entrada" fill="#fed65b" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="saida" fill="#ab2c5d" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center space-y-2">
              <BarChart3 className="mx-auto text-rose-100" size={32} />
              <p className="text-zinc-400 text-xs font-medium">Adicione uma finança para começar a contar</p>
            </div>
          )}
        </div>
        {monthlyHistory.length > 0 && (
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gold-200" />
              <span className="text-[10px] font-bold uppercase text-zinc-400">Entradas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="text-[10px] font-bold uppercase text-zinc-400">Saídas</span>
            </div>
          </div>
        )}
      </section>

      <section className="glass-card p-6 rounded-3xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-2xl font-bold text-zinc-800">Nossos Sonhos</h3>
          <div className="flex items-center gap-2">
            {dreams.length > 0 && (
              <button 
                onClick={() => setIsClearingAllDreams(true)}
                className="text-zinc-400 hover:text-rose-500 text-xs font-bold px-3 py-2 rounded-full hover:bg-rose-50 transition-all"
              >
                Limpar Tudo
              </button>
            )}
            <button 
              onClick={() => setIsAddingDream(true)}
              className="text-rose-400 p-2 hover:bg-rose-100 rounded-full transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
        
        <div className="hidden sm:block overflow-x-auto -mx-6 px-6 scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 w-[35%]">Sonho</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 w-[25%]">Progresso</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right w-[15%]">Meta</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right w-[15%]">Prazo</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right w-[10%]">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              <AnimatePresence mode="popLayout">
                {dreams.map((dream) => {
                  const percentage = Math.min(Math.round((dream.currentValue / dream.targetValue) * 100), 100);
                  return (
                    <motion.tr 
                      key={dream.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-rose-50/30 transition-colors"
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-gold-400 shrink-0">
                            <Target size={16} />
                          </div>
                          <span className="text-sm font-medium text-zinc-700 truncate">{dream.name}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex flex-col gap-1">
                          <div className="h-1.5 w-full bg-rose-50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              className="h-full primary-gradient"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-rose-400">{percentage}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-mono font-bold text-zinc-800 whitespace-nowrap">
                          R$ {dream.targetValue.toLocaleString('pt-BR')}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-xs text-zinc-500 whitespace-nowrap">{dream.targetDate}</span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openEditModal(dream)}
                            className="p-2 text-zinc-400 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition-all"
                            title="Editar sonho"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => setDreamToRemove(dream.id)}
                            className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Apagar sonho"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {dreams.length === 0 && (
            <div className="text-center py-12">
              <Heart className="mx-auto text-rose-200 mb-2" size={32} />
              <p className="text-zinc-400 text-sm font-medium">Nenhum sonho cadastrado ainda...</p>
            </div>
          )}
        </div>

        {/* Mobile View for Dreams */}
        <div className="sm:hidden space-y-4">
          <AnimatePresence mode="popLayout">
            {dreams.map((dream) => {
              const percentage = Math.min(Math.round((dream.currentValue / dream.targetValue) * 100), 100);
              return (
                <motion.div
                  key={dream.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-rose-50/30 rounded-2xl p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-gold-400">
                        <Target size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-800">{dream.name}</h4>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{dream.targetDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => openEditModal(dream)}
                        className="p-2 text-zinc-400 hover:text-gold-500"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => setDreamToRemove(dream.id)}
                        className="p-2 text-rose-300 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Progresso</span>
                      <span className="text-xs font-bold text-zinc-800">R$ {dream.targetValue.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full primary-gradient"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-bold text-rose-400">{percentage}%</span>
                      <span className="text-[10px] font-medium text-zinc-400">Faltam R$ {(dream.targetValue - dream.currentValue).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      <section className="glass-card p-6 rounded-3xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-xl font-bold text-zinc-800">Gastos do Mês</h3>
          <button 
            onClick={() => setIsAddingTransaction(true)}
            className="text-rose-400 flex items-center gap-1 font-bold text-sm hover:bg-rose-50 px-3 py-1 rounded-full transition-colors"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>
        
        <div className="h-48 w-full flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center space-y-2">
              <BarChart3 className="mx-auto text-rose-100" size={32} />
              <p className="text-zinc-400 text-xs font-medium">Nenhuma transação este mês</p>
            </div>
          )}
        </div>

        <div className="hidden sm:block overflow-x-auto -mx-6 px-6 scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 w-[35%]">Descrição</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 w-[15%]">Data</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 w-[15%]">Tipo</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right w-[25%]">Valor</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right w-[10%]">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              <AnimatePresence mode="popLayout">
                {transactions.map((item) => (
                  <motion.tr 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group hover:bg-rose-50/30 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium text-zinc-700 truncate">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-xs text-zinc-500 whitespace-nowrap">{item.date}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-1 rounded-full whitespace-nowrap",
                        item.type === 'income' ? "bg-green-100 text-green-600" : "bg-rose-100 text-rose-500"
                      )}>
                        {item.type === 'income' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className={cn("text-sm font-mono font-bold whitespace-nowrap", item.type === 'income' ? "text-green-600" : "text-zinc-800")}>
                        {item.type === 'income' ? '+' : '-'} R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => setTransactionToRemove(item.id)}
                        className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Apagar transação"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-zinc-400 text-xs font-medium italic">Nenhuma transação registrada</p>
            </div>
          )}
        </div>

        {/* Mobile View for Transactions */}
        <div className="sm:hidden space-y-3">
          <AnimatePresence mode="popLayout">
            {transactions.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between p-3 bg-rose-50/30 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800">{item.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={cn("text-sm font-mono font-bold", item.type === 'income' ? "text-green-600" : "text-zinc-800")}>
                      {item.type === 'income' ? '+' : '-'} R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <span className={cn(
                      "text-[9px] font-bold uppercase",
                      item.type === 'income' ? "text-green-500" : "text-rose-400"
                    )}>
                      {item.type === 'income' ? 'Entrada' : 'Saída'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setTransactionToRemove(item.id)}
                    className="p-2 text-rose-300 hover:text-rose-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Transaction Delete Confirmation Modal */}
      <AnimatePresence>
        {transactionToRemove && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTransactionToRemove(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-[2rem] p-8 editorial-shadow text-center space-y-6"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold text-zinc-800">Apagar Transação?</h3>
                <p className="text-zinc-500 text-sm">Esta ação removerá este registro das suas finanças.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setTransactionToRemove(null)}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    handleRemoveTransaction(transactionToRemove);
                    setTransactionToRemove(null);
                  }}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                >
                  Apagar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {isClearingAllDreams && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsClearingAllDreams(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-[2rem] p-8 editorial-shadow text-center space-y-6"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold text-zinc-800">Apagar Tudo?</h3>
                <p className="text-zinc-500 text-sm">Deseja realmente apagar todos os seus sonhos cadastrados?</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsClearingAllDreams(false)}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setDreams([]);
                    setIsClearingAllDreams(false);
                  }}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                >
                  Apagar Tudo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {dreamToRemove && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDreamToRemove(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-[2rem] p-8 editorial-shadow text-center space-y-6"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold text-zinc-800">Apagar Sonho?</h3>
                <p className="text-zinc-500 text-sm">Esta ação não pode ser desfeita.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDreamToRemove(null)}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    handleRemoveDream(dreamToRemove);
                    setDreamToRemove(null);
                  }}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
                >
                  Apagar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isAddingTransaction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingTransaction(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 editorial-shadow space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-2xl font-bold text-zinc-800">Nova Finança</h3>
                <button onClick={() => setIsAddingTransaction(false)} className="text-zinc-400 hover:text-rose-400">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Descrição</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Jantar romântico"
                    className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Valor (R$)</label>
                  <input 
                    type="number" 
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                </div>
                <div className="flex gap-2 p-1 bg-rose-50 rounded-2xl">
                  <button 
                    onClick={() => setNewType('expense')}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                      newType === 'expense' ? "bg-white text-rose-400 shadow-sm" : "text-zinc-400"
                    )}
                  >
                    Saída
                  </button>
                  <button 
                    onClick={() => setNewType('income')}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                      newType === 'income' ? "bg-white text-green-500 shadow-sm" : "text-zinc-400"
                    )}
                  >
                    Entrada
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddTransaction}
                className="w-full py-4 primary-gradient text-white rounded-full font-bold shadow-lg active:scale-95 transition-all"
              >
                Adicionar Finança
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Dream Modal */}
      <AnimatePresence>
        {editingDream && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingDream(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 editorial-shadow space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-2xl font-bold text-zinc-800">Editar Sonho</h3>
                <button onClick={() => setEditingDream(null)} className="text-zinc-400 hover:text-rose-400">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Nome do Sonho</label>
                  <input 
                    type="text" 
                    value={dreamName}
                    onChange={(e) => setDreamName(e.target.value)}
                    placeholder="Ex: Nossa Casa"
                    className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Meta (R$)</label>
                    <input 
                      type="text" 
                      value={dreamTarget}
                      onChange={(e) => setDreamTarget(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Já Temos (R$)</label>
                    <input 
                      type="text" 
                      value={dreamCurrent}
                      onChange={(e) => setDreamCurrent(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Prazo</label>
                  <input 
                    type="text" 
                    value={dreamDate}
                    onChange={(e) => setDreamDate(e.target.value)}
                    placeholder="Ex: Dezembro 2025"
                    className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleEditDream}
                className="w-full py-4 primary-gradient text-white rounded-full font-bold shadow-lg active:scale-95 transition-all"
              >
                Salvar Alterações
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Dream Modal */}
      <AnimatePresence>
        {isAddingDream && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingDream(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 editorial-shadow space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-2xl font-bold text-zinc-800">Novo Sonho</h3>
                <button onClick={() => setIsAddingDream(false)} className="text-zinc-400 hover:text-rose-400">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Nome do Sonho</label>
                  <input 
                    type="text" 
                    value={dreamName}
                    onChange={(e) => setDreamName(e.target.value)}
                    placeholder="Ex: Nossa Casa"
                    className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Meta (R$)</label>
                    <input 
                      type="number" 
                      value={dreamTarget}
                      onChange={(e) => setDreamTarget(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Já temos (R$)</label>
                    <input 
                      type="number" 
                      value={dreamCurrent}
                      onChange={(e) => setDreamCurrent(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Data Prevista</label>
                  <input 
                    type="text" 
                    value={dreamDate}
                    onChange={(e) => setDreamDate(e.target.value)}
                    placeholder="Ex: Dezembro 2026"
                    className="w-full bg-rose-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-200 outline-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddDream}
                className="w-full py-4 primary-gradient text-white rounded-full font-bold shadow-lg active:scale-95 transition-all"
              >
                Cadastrar Sonho
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
