
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

export default function Connexion() {
  const [email, setCourriel] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { login, user } = useAuth();
  const { setOnAction } = useChatContext();

  useEffect(() => {
    setOnAction(() => (cmd) => {
      if (/help/i.test(cmd)) {
        return 'Utilisez le formulaire pour vous connecter.';
      }
      return 'Commande inconnue.';
    });
    return () => setOnAction(null);
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const submit = async e => {
    e.preventDefault();
    const ok = await login(email.trim(), password);
    if (ok) {
      navigate('/', { replace: true });
    } else {
      setError('Identifiants incorrects (admin / admin)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Se connecter</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={email}
              onChange={e => setCourriel(e.target.value)}
              type="text"
              placeholder="Nom d'utilisateur"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Mot de passe"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-md transition"
          >
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}
