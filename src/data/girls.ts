export interface GirlData {
  code: string;
  name: string;
  avatar: string;
  message: string;
}

export const girls: GirlData[] = [
  {
    code: "111111",
    name: "Анна",
    avatar: "/avatars/demo_1.jpg",
    message:
      "Анна, с 8 Марта! Ты невероятный человек, который умеет вдохновлять одним своим присутствием. Пусть эта весна принесёт тебе столько же тепла и радости, сколько ты даришь окружающим каждый день.",
  },
  {
    code: "222222",
    name: "Мария",
    avatar: "/avatars/demo_2.jpg",
    message:
      "Мария, с 8 Марта! Твоя энергия и улыбка способны осветить даже самый пасмурный день. Желаю тебе лёгкости, ярких моментов и только приятных сюрпризов в этом году.",
  },
  {
    code: "333333",
    name: "Екатерина",
    avatar: "/avatars/demo_3.jpg",
    message:
      "Екатерина, с 8 Марта! С тобой рядом всегда спокойно и уютно — это редкий и ценный дар. Пусть весна будет к тебе мягкой и приносит только поводы для хорошего настроения!",
  },
];

export const findByCode = (code: string): GirlData | undefined =>
  girls.find((g) => g.code.toLowerCase() === code.trim().toLowerCase());