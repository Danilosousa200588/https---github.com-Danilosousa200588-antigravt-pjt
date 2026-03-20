import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, BookOpen, ChevronRight, CheckCircle2, XCircle, RefreshCcw, ArrowLeft, Play, Lock, Star, Trophy } from 'lucide-react';
import { NURSING_QUIZZES, BIBLE_QUIZZES } from '../constants/quizzes';
import { Quiz } from '../types';
import { cn } from '../lib/utils';

const POINTS_PER_CORRECT = 100;
const UNLOCK_THRESHOLDS = {
  easy: 0,
  medium: 1000,
  advanced: 2000,
  hard: 3000,
  professional: 4000
};

const DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Médio',
  advanced: 'Avançado',
  hard: 'Difícil',
  professional: 'Profissional'
};

export default function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState<'nursing' | 'bible' | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const [nursingPoints, setNursingPoints] = useState<number>(() => {
    const saved = localStorage.getItem('amethyst_quiz_points_nursing');
    return saved ? parseInt(saved) : 0;
  });

  const [biblePoints, setBiblePoints] = useState<number>(() => {
    const saved = localStorage.getItem('amethyst_quiz_points_bible');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('amethyst_quiz_points_nursing', nursingPoints.toString());
  }, [nursingPoints]);

  useEffect(() => {
    localStorage.setItem('amethyst_quiz_points_bible', biblePoints.toString());
  }, [biblePoints]);

  const currentPoints = selectedCategory === 'nursing' ? nursingPoints : biblePoints;

  const handleQuizSelect = (quiz: Quiz) => {
    const threshold = UNLOCK_THRESHOLDS[quiz.difficulty];
    const points = quiz.category === 'nursing' ? nursingPoints : biblePoints;
    if (points < threshold) return;
    
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === selectedQuiz!.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
      if (selectedQuiz?.category === 'nursing') {
        setNursingPoints(prev => prev + POINTS_PER_CORRECT);
      } else {
        setBiblePoints(prev => prev + POINTS_PER_CORRECT);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleNextQuiz = () => {
    const currentQuizzes = selectedCategory === 'nursing' ? NURSING_QUIZZES : BIBLE_QUIZZES;
    const currentIndex = currentQuizzes.findIndex(q => q.id === selectedQuiz?.id);
    const nextQuiz = currentQuizzes[(currentIndex + 1) % currentQuizzes.length];
    
    const threshold = UNLOCK_THRESHOLDS[nextQuiz.difficulty];
    const points = nextQuiz.category === 'nursing' ? nursingPoints : biblePoints;
    if (points < threshold) {
      setSelectedQuiz(null);
      setShowResult(false);
    } else {
      handleQuizSelect(nextQuiz);
    }
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
      >
        <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center text-rose-400">
          <Trophy size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="font-headline text-3xl font-bold text-zinc-800">Parabéns!</h2>
          <p className="text-zinc-500">Você completou o quiz: {selectedQuiz?.title}</p>
          <p className="text-emerald-500 font-bold">+{score * POINTS_PER_CORRECT} pontos ganhos!</p>
        </div>
        <div className="text-5xl font-bold text-rose-400">
          {score} / {selectedQuiz?.questions.length}
        </div>
        
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={handleNextQuiz}
            className="flex items-center justify-center gap-2 w-full py-4 primary-gradient text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
          >
            <Play size={20} fill="currentColor" />
            Próximo Quiz
          </button>
          <button 
            onClick={() => {
              setSelectedQuiz(null);
              setShowResult(false);
            }}
            className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-rose-100 text-rose-400 rounded-2xl font-bold shadow-sm active:scale-95 transition-all"
          >
            <RefreshCcw size={20} />
            Voltar à Lista
          </button>
        </div>
      </motion.div>
    );
  }

  if (selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestionIndex];
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 space-y-8"
      >
        <div className="flex justify-between items-center">
          <button onClick={() => setSelectedQuiz(null)} className="text-rose-400 font-bold text-sm flex items-center gap-1">
            <ArrowLeft size={16} />
            Sair
          </button>
          <div className="flex items-center gap-2 bg-rose-50 px-3 py-1 rounded-full">
            <Star size={14} className="text-gold-400" fill="currentColor" />
            <span className="text-xs font-bold text-rose-400">{currentPoints}</span>
          </div>
          <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Questão {currentQuestionIndex + 1} de {selectedQuiz.questions.length}</span>
        </div>

        <div className="space-y-6">
          <h3 className="font-headline text-2xl font-bold text-zinc-800 leading-tight">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const isSelected = index === selectedOption;
              
              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full p-5 rounded-2xl text-left font-medium transition-all duration-300 border-2",
                    !isAnswered && "bg-white border-rose-50 hover:border-rose-200 editorial-shadow",
                    isAnswered && isCorrect && "bg-green-50 border-green-200 text-green-700",
                    isAnswered && isSelected && !isCorrect && "bg-red-50 border-red-200 text-red-700",
                    isAnswered && !isSelected && !isCorrect && "bg-white border-rose-50 opacity-50"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 size={20} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle size={20} />}
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-4 bg-rose-50 rounded-2xl text-sm text-rose-500 italic">
                  {question.explanation}
                </div>
                <button 
                  onClick={handleNext}
                  className="w-full py-4 primary-gradient text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Ver Resultado' : 'Próxima Questão'}
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  if (selectedCategory) {
    const quizzes = selectedCategory === 'nursing' ? NURSING_QUIZZES : BIBLE_QUIZZES;
    const levels: (keyof typeof UNLOCK_THRESHOLDS)[] = ['easy', 'medium', 'advanced', 'hard', 'professional'];

    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedCategory(null)} className="p-2 bg-white rounded-full editorial-shadow text-rose-400">
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-headline text-3xl font-bold text-zinc-800">
              {selectedCategory === 'nursing' ? 'Enfermagem' : 'Bíblico'}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-2xl">
            <Star size={18} className="text-gold-400" fill="currentColor" />
            <span className="font-bold text-rose-400">{currentPoints}</span>
          </div>
        </div>

        <div className="space-y-10">
          {levels.map((level) => {
            const levelQuizzes = quizzes.filter(q => q.difficulty === level);
            const threshold = UNLOCK_THRESHOLDS[level];
            const points = selectedCategory === 'nursing' ? nursingPoints : biblePoints;
            const isLocked = points < threshold;

            if (levelQuizzes.length === 0) return null;

            return (
              <div key={level} className="space-y-4">
                <div className="flex justify-between items-center ml-1">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Nível {DIFFICULTY_LABELS[level]}
                  </h3>
                  {isLocked && (
                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">
                      Desbloqueia com {threshold} pontos
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {levelQuizzes.map((quiz) => (
                    <div 
                      key={quiz.id}
                      onClick={() => !isLocked && handleQuizSelect(quiz)}
                      className={cn(
                        "glass-card p-6 rounded-3xl space-y-2 transition-all border border-transparent relative overflow-hidden",
                        isLocked ? "opacity-60 grayscale cursor-not-allowed" : "cursor-pointer hover:bg-rose-50/50 hover:border-rose-100"
                      )}
                    >
                      {isLocked && (
                        <div className="absolute top-4 right-4 text-rose-300">
                          <Lock size={20} />
                        </div>
                      )}
                      <h3 className="font-bold text-zinc-800 text-lg">{quiz.title}</h3>
                      <p className="text-zinc-500 text-sm">{quiz.description}</p>
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest pt-2">
                        <span>{isLocked ? 'Bloqueado' : 'Começar'}</span>
                        {!isLocked && <ChevronRight size={14} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h2 className="font-headline text-4xl font-bold text-rose-400">Quizzes</h2>
          <p className="text-zinc-500">Desafie seus conhecimentos.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-2xl editorial-shadow">
            <GraduationCap size={16} className="text-rose-400" />
            <span className="font-bold text-rose-400 text-sm">{nursingPoints} pts</span>
          </div>
          <div className="flex items-center gap-2 bg-gold-50 px-4 py-2 rounded-2xl editorial-shadow">
            <BookOpen size={16} className="text-gold-400" />
            <span className="font-bold text-gold-400 text-sm">{biblePoints} pts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div 
          onClick={() => setSelectedCategory('nursing')}
          className="glass-card p-8 rounded-[2.5rem] space-y-4 cursor-pointer hover:scale-[1.02] transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-400 group-hover:primary-gradient group-hover:text-white transition-all">
            <GraduationCap size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-headline text-2xl font-bold text-zinc-800">Enfermagem</h3>
            <p className="text-zinc-500 text-sm">Diversos temas sobre a arte de cuidar.</p>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm pt-2">
            <span>Ver Temas</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div 
          onClick={() => setSelectedCategory('bible')}
          className="glass-card p-8 rounded-[2.5rem] space-y-4 cursor-pointer hover:scale-[1.02] transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center text-gold-300 group-hover:bg-gold-200 transition-all">
            <BookOpen size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-headline text-2xl font-bold text-zinc-800">Bíblico</h3>
            <p className="text-zinc-500 text-sm">Aprofunde-se nas escrituras sagradas.</p>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm pt-2">
            <span>Ver Temas</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
