
// src/pages/StrategicView.jsx
// Dark-mode polished Vue stratégique
// ────────────────────────────────────────────────────────────────────────────────
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import { useChatContext } from '../context/ChatContext';

/* THEME COLORS */
const PRIMARY = "#1e90ff";            // main accent
const PRIMARY_LIGHT = "#7ab8ff";      // lighter accent
const TICK_DARK = "#d1d5db";          // gray-300 for dark grid / axis

/* ────────────────────────────────────────────────────────────────────────── */
/* 1) Live Visitors Counter                                                 */
/* ────────────────────────────────────────────────────────────────────────── */
const LiveVisitorsCard = () => {
  const sparkData = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        minute: i - 29,
        visitors: Math.floor(50 + Math.random() * 250),
      })),
    []
  );
  const currentVisitors = sparkData[sparkData.length - 1].visitors;

  return (
    <Card className="h-full bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold dark:text-gray-100">
          Visiteurs en direct
        </CardTitle>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-4xl font-bold"
          style={{ color: PRIMARY }}
        >
          {currentVisitors}
        </motion.p>
      </CardHeader>
      <CardContent className="pb-6 pt-0">
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.5} />
                <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="visitors"
              stroke={PRIMARY}
              fill="url(#sparkGradient)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
/* 2) Articles Published vs. Views                                         */
/* ────────────────────────────────────────────────────────────────────────── */
const ArticlesVsViewsCard = () => {
  const barData = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const articles = 5 + Math.floor(Math.random() * 6);
        return {
          day: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(
            "en-GB",
            { month: "short", day: "numeric" }
          ),
          articles,
          views: articles * (800 + Math.floor(Math.random() * 1200)),
        };
      }),
    []
  );

  const tickStyle = {
    fill: TICK_DARK,
    fontSize: 12,
  };

  return (
    <Card className="h-full bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold dark:text-gray-100">
          Articles publiés vs. vues (7 jours)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={TICK_DARK} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={tickStyle} />
            <YAxis yAxisId="left" stroke={TICK_DARK} tick={tickStyle} />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={TICK_DARK}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={tickStyle}
            />
            <Tooltip
              contentStyle={{ background: "#111827", border: "none" }}
              itemStyle={{ color: "#fff" }}
              labelStyle={{ color: "#fff" }}
              formatter={(v) => v.toLocaleString()}
            />
            <Bar yAxisId="left" dataKey="articles" fill={PRIMARY} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="views" fill={PRIMARY_LIGHT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
/* 3) Top-5 Countries list                                                 */
/* ────────────────────────────────────────────────────────────────────────── */
const CountriesListCard = () => {
  const countryData = React.useMemo(
    () => [
      { name: "Morocco", value: 5200 },
      { name: "Nigeria", value: 3500 },
      { name: "Egypt", value: 2900 },
      { name: "South Africa", value: 2400 },
      { name: "Kenya", value: 1900 },
    ],
    []
  );

  return (
    <Card className="h-full bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold dark:text-gray-100">
          Top 5 des pays
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2 divide-y divide-gray-200 dark:divide-gray-700">
          {countryData.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between pt-2 first:pt-0 text-gray-800 dark:text-gray-100"
            >
              <span>{c.name}</span>
              <span className="font-medium" style={{ color: PRIMARY }}>
                {c.value.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
/* 4) Trending Keywords list                                               */
/* ────────────────────────────────────────────────────────────────────────── */
const KeywordsListCard = () => {
  const keywordsData = React.useMemo(() => {
    const keywords = ["TekAfrika", "Kamal", "AI", "Climate", "Startup", "Crypto", "E-commerce"];
    return keywords.map((k, idx) => ({ keyword: k, score: 100 - idx * 10 }));
  }, []);

  return (
    <Card className="h-full bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold dark:text-gray-100">
          Mots-clés tendance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2 divide-y divide-gray-200 dark:divide-gray-700">
          {keywordsData.map((k) => (
            <li
              key={k.keyword}
              className="flex items-center justify-between pt-2 first:pt-0 text-gray-800 dark:text-gray-100"
            >
              <span>{k.keyword}</span>
              <span className="font-medium" style={{ color: PRIMARY }}>
                {k.score}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
/* Main Vue stratégique                                                     */
/* ────────────────────────────────────────────────────────────────────────── */
const StrategicView = () => {
  const { setOnAction } = useChatContext();
  useEffect(() => {
    setOnAction(() => (cmd) => {
      if (/help/i.test(cmd)) {
        return 'Commandes disponibles: /action help (affiche cette aide)';
      }
      return 'Commande inconnue.';
    });
    return () => setOnAction(null);
  }, []);

  return (
  <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
    {/* Row 1 */}
    <div className="flex flex-col gap-6 xl:flex-row xl:col-span-2">
      <div className="w-full xl:w-1/3">
        <LiveVisitorsCard />
      </div>
      <div className="w-full xl:w-2/3">
        <ArticlesVsViewsCard />
      </div>
    </div>
    {/* Row 2 */}
    <CountriesListCard />
    <KeywordsListCard />
  </div>
  );
};

export default StrategicView;
