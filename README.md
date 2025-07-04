# 📰 SmartNews360

> Plateforme intelligente de veille médiatique et génération de contenu éditorial via Llama 3 (API Groq)

---

## 📌 Description

SmartNews360 est une application web interactive conçue pour les professionnels de la communication, les journalistes et les rédacteurs. Elle permet de suivre les sujets d’actualité en temps réel, de visualiser les tendances médiatiques, et de générer automatiquement des titres ou plans d’articles grâce à un modèle d’intelligence artificielle (Llama 3 Instruct via Groq).

Le projet a été réalisé dans le cadre d’un **stage d’initiation de 3ᵉ année** au sein de l’entreprise **S4U**, spécialisée dans les solutions numériques innovantes.

---

## 🎯 Fonctionnalités principales

- 🔍 **Veille médiatique** : affichage de sujets tendances et simulation d’un flux d’actualité
- ✍️ **Génération IA** : création automatique de titres, paragraphes et plans d’articles
- 🎛️ **Filtres dynamiques** : par langue, période, catégorie, etc.
- 🌗 **Mode sombre/claire** : bascule native avec mémorisation
- 🚀 **Interface rapide & responsive** : conçue avec React, Vite et Tailwind CSS

---

## 🛠️ Stack technique

| Technologie   | Rôle                                  |
|---------------|----------------------------------------|
| React         | Framework front-end                   |
| Vite          | Bundler rapide                        |
| Tailwind CSS  | Design UI moderne et responsive       |
| Zustand       | Gestion légère de l'état              |
| Groq API      | Génération de contenu IA (Llama 3)    |
| Netlify/Vercel| Déploiement statique                  |

---

## ⚙️ Installation locale

```bash
git clone https://github.com/votre-utilisateur/smartnews360.git
cd smartnews360
npm install
npm run dev
```

📌 Crée un fichier `.env` à la racine avec :

```env
VITE_GROQ_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

🧠 Aperçu IA (Llama 3 via Groq)

```js
fetch('/api/groq', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama3-8b-8192',
    messages: [
      { role: 'user', content: 'Génère 5 titres d’articles sur les énergies renouvelables au Maroc.' }
    ]
  })
})
```

---

## 📄 Rapport de Stage

📘 Télécharger le rapport PDF

Ce document retrace les étapes du projet, les choix techniques, les résultats obtenus ainsi que le bilan personnel du stagiaire.

---

## 📌 Auteur

👨‍🎓 Jawad El Kharrati  
3ᵉ année – Data Science & Cloud Computing  
ENSAO – École Nationale des Sciences Appliquées d’Oujda  
📫 jawad.elkharrati.23@ump.ac.ma

---

## 🏢 Encadré par

M. Kamal Benamrhar  
Serial Digital Entrepreneur – Tech Speaker  
📍 S4U | Smart Solutions For You

---

## 🌐 Licence

Projet réalisé à des fins pédagogiques. Toute réutilisation ou publication doit mentionner l’auteur et l’établissement d’origine.
