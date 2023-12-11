import Image from "next/image";
import { Inter } from "next/font/google";
import logo from "@/public/santaLogo.png";
import { useEffect, useRef, useState } from "react";
import openai from "@/utils/openai";
import ChatMessage from "@/components/ChatMessage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const message = useRef<HTMLInputElement>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  useEffect(() => {
    welcome();
  }, []);

  const welcome = async () => {
    const gptQuery =
      "De acum tu esti Mos Craciun, vei raspunde la acest mesaj cu faptul ca esti Mos Craciun si ca imi asculti dorintele. Dupa aceea vei comunica in continuare conform personajului";

    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuery }],
      model: "gpt-3.5-turbo",
    });

    setChatMessages((chatMessages) => [
      `Mos Craciun🎅: ${gptResults.choices[0].message.content}`,
      ...chatMessages,
    ]);
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChatMessages((chatMessages) => [
      `Copil: ${message.current!.value}`,
      ...chatMessages,
    ]);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-2 p-24 bg-slate-400 ${inter.className}`}
    >
      <Image src={logo} alt="logo" width="300" height="300" />
      <div className="w-[60%] h-[600px] ml-2 p-2 border border-black bg-slate-100 rounded-lg overflow-y-scroll flex flex-col-reverse ">
        {chatMessages.map((message) => (
          <ChatMessage key={message} message={message} />
        ))}
      </div>
      <form
        onSubmit={handleSend}
        className="flex justify-center w-[60%] p-2 ml-2 border border-black rounded-lg"
      >
        <input
          ref={message}
          className="p-2 w-full rounded-lg"
          placeholder="Spune-i mosului ce-ti doresti sa-ti aduca!"
        />
        <button className="px-2 mx-2 bg-green-100 rounded-lg">Trimite</button>
      </form>
    </main>
  );
}
